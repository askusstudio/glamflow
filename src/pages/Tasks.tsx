import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, MoreVertical, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const PRIORITIES = ["low", "medium", "high", "urgent"];
const STATUSES = ["to-do", "in progress", "completed"];
const TASK_TYPES = ["client prep", "inventory check", "product ordering", "social media post", "follow-up call", "other"];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ 
    title: "", 
    description: "",
    priority: "medium",
    status: "to-do",
    assigned_to: "",
    due_date: "",
    start_date: "",
    estimated_duration: "",
    task_type: "",
    category_tags: ""
  });
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
    if (!form.title) {
      toast({ title: "Error", description: "Task title is required", variant: "destructive" });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    try {
      const taskData = {
        ...form,
        category_tags: form.category_tags ? form.category_tags.split(',').map(t => t.trim()) : [],
        due_date: form.due_date || null,
        start_date: form.start_date || null,
      };

      if (editingTask) {
        const { error } = await supabase.from("tasks").update(taskData).eq("id", editingTask.id);
        if (error) throw error;
        toast({ title: "Success", description: "Task updated successfully" });
      } else {
        const { error } = await supabase.from("tasks").insert([{ ...taskData, user_id: user.id }]);
        if (error) throw error;
        toast({ title: "Success", description: "Task added successfully" });
      }
      
      clearForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({ title: "Error", description: "Failed to save task", variant: "destructive" });
    }
  };

  const handleDelete = async (task) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id);
      if (error) throw error;
      toast({ title: "Success", description: "Task deleted successfully" });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({ title: "Error", description: "Failed to delete task", variant: "destructive" });
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({ 
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status || "to-do",
      assigned_to: task.assigned_to || "",
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
      start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : "",
      estimated_duration: task.estimated_duration || "",
      task_type: task.task_type || "",
      category_tags: task.category_tags ? task.category_tags.join(', ') : ""
    });
    setShowAdd(true);
  };

  const clearForm = () => {
    setForm({ 
      title: "", 
      description: "",
      priority: "medium",
      status: "to-do",
      assigned_to: "",
      due_date: "",
      start_date: "",
      estimated_duration: "",
      task_type: "",
      category_tags: ""
    });
    setEditingTask(null);
    setShowAdd(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddOrEdit();
    }
  };

  // For row actions menu toggle
  const toggleActions = (taskId) => {
    setShowActions(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <>
    
      <div className="bg-background min-h-screen p-4 md:p-8 bg-[#DB6C79]/10">
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
                        ${task.priority === "urgent" ? "bg-red-500/80 text-white" :
                          task.priority === "high" ? "bg-red-300/70 text-red-900" :
                          task.priority === "medium" ? "bg-yellow-200 text-yellow-900" :
                          "bg-green-200 text-green-900"}
                      `}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 md:px-4 py-3 hidden md:table-cell">
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${task.status === "completed" ? "bg-green-200 text-green-900" :
                          task.status === "in progress" ? "bg-blue-200 text-blue-900" :
                          "bg-gray-200 text-gray-900"}
                      `}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </TableCell>
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
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4" onKeyPress={handleKeyPress}>
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="Task Title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description or notes"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full p-2 border rounded bg-background"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full p-2 border rounded bg-background"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task_type">Task Type</Label>
              <select
                id="task_type"
                className="w-full p-2 border rounded bg-background"
                value={form.task_type}
                onChange={e => setForm(f => ({ ...f, task_type: e.target.value }))}
              >
                <option value="">Select task type</option>
                {TASK_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input
                id="assigned_to"
                placeholder="Team member or self"
                value={form.assigned_to}
                onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estimated_duration">Estimated Duration</Label>
              <Input
                id="estimated_duration"
                placeholder="e.g., 2 hours, 1 day"
                value={form.estimated_duration}
                onChange={e => setForm(f => ({ ...f, estimated_duration: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category_tags">Category Tags (comma-separated)</Label>
              <Input
                id="category_tags"
                placeholder="urgent, follow-up, client"
                value={form.category_tags}
                onChange={e => setForm(f => ({ ...f, category_tags: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={clearForm}>Cancel</Button>
            <Button onClick={handleAddOrEdit}>
              {editingTask ? "Update" : "Add"}
            </Button>
          </DialogFooter>
          <p className="text-xs text-muted-foreground mt-2">Press Ctrl+Enter to save</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
