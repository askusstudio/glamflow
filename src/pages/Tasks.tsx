import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreVertical, Edit, Trash } from "lucide-react";
import Navbar from "@/components/general/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";

const PRIORITIES = ["low", "medium", "high"];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", priority: "medium" });
  const [showActions, setShowActions] = useState({});

  useEffect(() => { fetchTasks(); }, [priority, search]);

  const fetchTasks = async () => {
    let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (priority) query = query.eq("priority", priority);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data } = await query;
    setTasks(data || []);
  };

  const handleAddOrEdit = async () => {
    if (!form.title) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    if (editingTask) {
      await supabase.from("tasks").update(form).eq("id", editingTask.id);
    } else {
      await supabase.from("tasks").insert([{ ...form, user_id: user.id }]);
    }
    setForm({ title: "", priority: "medium" });
    setShowAdd(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (task) => {
    await supabase.from("tasks").delete().eq("id", task.id);
    fetchTasks();
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, priority: task.priority });
    setShowAdd(true);
  };

  const clearForm = () => {
    setForm({ title: "", priority: "medium" });
    setEditingTask(null);
    setShowAdd(false);
  };

  // For row actions menu toggle
  const toggleActions = (taskId) => {
    setShowActions(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto rounded-xl shadow-lg bg-card p-4 md:p-6">
          {/* Filter & Add bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Input
                placeholder="Filter tasks..."
                className="w-full sm:min-w-[200px] sm:max-w-xs"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="px-3 py-2 rounded bg-background border focus:outline-primary text-foreground w-full sm:w-auto"
              >
                <option value="">All Priorities</option>
                {PRIORITIES.map(p => <option key={p} value={p}>{p[0].toUpperCase()+p.slice(1)}</option>)}
              </select>
            </div>
            <Button
              onClick={() => setShowAdd(true)}
              className="bg-primary rounded-lg px-5 py-2 flex gap-2 items-center hover:bg-primary/90 w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              {/* <TableHead>
                <TableRow>
                  <TableCell className="w-[38%] px-4 py-3 text-lg">Title</TableCell>
                  <TableCell className="w-[15%] px-4 py-3 text-lg">Priority</TableCell>
                  <TableCell className="w-[15%] px-4 py-3 text-lg">Status</TableCell>
                  <TableCell className="w-[20%] px-4 py-3 text-lg">Created</TableCell>
                  <TableCell className="w-[12%] px-4 py-3 text-lg text-center">Actions</TableCell>
                </TableRow>
              </TableHead> */}
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-muted/20">
                    <TableCell className="px-2 md:px-4 py-3">
                      <div className="font-medium">{task.title}</div>
                      <div className="block md:hidden text-xs text-muted-foreground mt-1">
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 md:px-4 py-3 hidden sm:table-cell">
                      <span className={`
                        px-2 md:px-3 py-1 rounded font-semibold text-xs
                        ${task.priority === "high" ? "bg-red-300/70 text-red-900" :
                          task.priority === "medium" ? "bg-yellow-200 text-yellow-900" :
                          "bg-green-200 text-green-900"}
                      `}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 md:px-4 py-3 hidden md:table-cell">{task.completed ? "Done" : "Pending"}</TableCell>
                    <TableCell className="px-2 md:px-4 py-3 hidden md:table-cell">{new Date(task.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="px-2 md:px-4 py-3 flex justify-center items-center gap-2 relative">
                      <Button variant="ghost" size="icon" onClick={() => toggleActions(task.id)}>
                        <MoreVertical />
                      </Button>
                      {showActions[task.id] && (
                        <div className="absolute right-0 top-10 w-32 md:w-36 bg-card border rounded-md shadow-lg z-20">
                          <button
                            onClick={() => openEdit(task)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-200/40 transition-colors"
                          >
                            <Trash className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground p-8">No tasks found.</div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Task */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            {editingTask ? "Edit Task" : "Add Task"}
          </DialogHeader>
          <Input
            placeholder="Task Title"
            className="mb-3"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <select
            className="border mb-3 px-2 py-1 rounded w-full"
            value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
          >
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <DialogFooter>
            <Button onClick={handleAddOrEdit}>
              {editingTask ? "Update" : "Add"}
            </Button>
            <Button variant="secondary" onClick={clearForm}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
