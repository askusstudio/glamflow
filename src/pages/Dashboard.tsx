import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

import {
  Calendar,
  Target,
  TrendingUp,
  Plus,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Star
} from "lucide-react"

interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  created_at: string
  user_id: string
  updated_at: string
}

interface Appointment {
  id: string
  client_name: string
  service: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  user_id: string
  updated_at: string
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [newAppointmentData, setNewAppointmentData] = useState({
    client_name: '',
    service: '',
    appointment_time: ''
  })
  const { toast } = useToast()

  // These should also be fetched from your database eventually
  const todayEarnings = 8500
  const monthlyGoal = 50000
  const progress = (todayEarnings / monthlyGoal) * 100

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      const today = new Date().toISOString().split('T')[0]
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_time', today)
        .lt('appointment_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('appointment_time', { ascending: true })

      if (tasksError) {
        console.error('Tasks error:', tasksError)
        toast({
          title: "Error",
          description: "Failed to fetch tasks. Please try again.",
          variant: "destructive"
        })
        setTasks([])
      } else {
        setTasks(tasksData as Task[] || [])
      }

      if (appointmentsError) {
        console.error('Appointments error:', appointmentsError)
        toast({
          title: "Error",
          description: "Failed to fetch appointments. Please try again.",
          variant: "destructive"
        })
        setAppointments([])
      } else {
        setAppointments(appointmentsData as Appointment[] || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) return

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a task.",
        variant: "destructive"
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTaskTitle.trim(),
          priority: 'medium' as const,
          completed: false,
          user_id: user.id
        }])
        .select()

      if (error) throw error

      if (data && data[0]) {
        setTasks(prev => [data[0] as Task, ...prev])
        setNewTaskTitle('')
        setShowAddTask(false)
        toast({
          title: "Success",
          description: "Task added successfully!"
        })
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive"
      })
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', taskId)

      if (error) throw error

      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, completed: !completed } : task
      ))

      toast({
        title: "Success",
        description: `Task ${!completed ? 'completed' : 'reopened'}!`
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      })
    }
  }

  const addAppointment = async () => {
    if (!newAppointmentData.client_name || !newAppointmentData.service || !newAppointmentData.appointment_time) {
      toast({
        title: "Error",
        description: "Please fill in all appointment details.",
        variant: "destructive"
      })
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add an appointment.",
        variant: "destructive"
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...newAppointmentData,
          user_id: user.id,
          status: 'pending' as const,
          client_email: 'temp@example.com',
          client_phone: '0000000000'
        } as any])
        .select()

      if (error) throw error

      if (data && data[0]) {
        setAppointments(prev => [...prev, data[0] as Appointment])
        setNewAppointmentData({
          client_name: '',
          service: '',
          appointment_time: ''
        })
        setShowAddAppointment(false)
        toast({
          title: "Success",
          description: "Appointment added successfully!"
        })
      }
    } catch (error) {
      console.error('Error adding appointment:', error)
      toast({
        title: "Error",
        description: "Failed to add appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(prev => prev.map(appointment =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      ))

      toast({
        title: "Success",
        description: `Appointment ${newStatus}!`
      })
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast({
        title: "Error",
        description: "Failed to update appointment status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return 'Invalid time'
    }
  }

  const handleQuickAdd = () => {
    // Toggle between showing add task or add appointment
    if (Math.random() > 0.5) {
      setShowAddTask(true)
    } else {
      setShowAddAppointment(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-spin" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
  

      <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Beautiful! ✨</h1>
            <p className="text-muted-foreground text-sm md:text-base">Here's what's happening with your beauty business today.</p>
          </div>
          <Button
            onClick={handleQuickAdd}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* <Card className="hover:shadow-soft transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold text-success">₹{todayEarnings.toLocaleString()}</div> */}
          {/* <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card> */}

          <Card className="hover:shadow-soft transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {appointments.filter(a => a.status === 'confirmed').length} confirmed, {appointments.filter(a => a.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>


          <Card className="hover:shadow-soft transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Pending</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.filter(t => !t.completed && t.priority === 'high').length} high priority items
              </p>
            </CardContent>
          </Card>


          {/* <Card className="hover:shadow-soft transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">of ₹{monthlyGoal.toLocaleString()} goal</p>
            </CardContent>
          </Card> */}

        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* The main card container */}
          <Card> {/* Removed bg-gray-50 for a cleaner white background */}
            <CardHeader>
              <CardTitle className="font-bold text-lg"> {/* Made title bolder */}
                Today's Appointments
              </CardTitle>
              {/* CardDescription was removed to match the image */}
            </CardHeader>
            <CardContent className="space-y-3"> {/* Adjusted spacing */}
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No appointments scheduled for today
                </p>
              ) : (
                appointments.map((appointment) => (
                  // This is the updated appointment item card
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
                  >
                    {/* Left side: Avatar + Client Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-foreground text-primary font-bold shrink-0">
                        {appointment.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0">
                        <p className="font-semibold text-sm">{appointment.client_name}</p>
                        <p className="text-xs text-muted-foreground">{appointment.service}</p>
                      </div>
                    </div>

                    {/* Right side: Status Badge + Time */}
                    <div className="flex flex-col items-end">
                      <Badge
                        className={`capitalize border-none text-xs font-semibold
                  ${appointment.status === 'pending'
                            ? 'bg-yellow-400/20 text-yellow-600 dark:bg-yellow-400/30 dark:text-yellow-400'
                            : 'bg-green-400/20 text-green-600 dark:bg-green-400/30 dark:text-green-400'
                          }`}
                        // The onClick handler is kept from your original code
                        onClick={() => updateAppointmentStatus(appointment.id, appointment.status === 'confirmed' ? 'pending' : 'confirmed')}
                      >
                        {appointment.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(appointment.appointment_time)}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* The "Add Appointment" form and button from your original code */}
              {showAddAppointment && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                  <Input
                    placeholder="Client name"
                    value={newAppointmentData.client_name}
                    onChange={(e) => setNewAppointmentData(prev => ({ ...prev, client_name: e.target.value }))}
                  />
                  <Input
                    placeholder="Service"
                    value={newAppointmentData.service}
                    onChange={(e) => setNewAppointmentData(prev => ({ ...prev, service: e.target.value }))}
                  />
                  <Input
                    type="datetime-local"
                    value={newAppointmentData.appointment_time}
                    onChange={(e) => setNewAppointmentData(prev => ({ ...prev, appointment_time: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button onClick={addAppointment} size="sm">Add</Button>
                    <Button onClick={() => setShowAddAppointment(false)} variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddAppointment(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </CardContent>
          </Card>



          <Card> {/* Removed bg-gray-50 for a clean white look */}
            <CardHeader>
              <CardTitle className="font-bold text-lg"> {/* Bolder title */}
                Priority Tasks
              </CardTitle>
              {/* CardDescription was removed to simplify the header */}
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No tasks yet. Add your first task!
                </p>
              ) : (
                tasks.map((task) => (
                  // This is the updated task item
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3 bg-muted/40 rounded-lg"
                  >
                    <button onClick={() => toggleTask(task.id, task.completed)}>
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-muted-foreground/50 rounded-full shrink-0"></div>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                    </div>
                    <Badge
                      className={`capitalize border-none text-xs font-semibold
                ${task.priority === "high"
                          ? 'bg-red-400/20 text-red-600 dark:bg-red-400/30 dark:text-red-400'
                          : task.priority === "medium"
                            ? 'bg-blue-400/20 text-blue-600 dark:bg-blue-400/30 dark:text-blue-400'
                            : 'bg-slate-400/20 text-slate-600 dark:bg-slate-400/30 dark:text-slate-400'
                        }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}

              {/* The "Add Task" form and button from your original code */}
              {showAddTask && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                  <Input
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <div className="flex gap-2">
                    <Button onClick={addTask} size="sm">Add</Button>
                    <Button onClick={() => setShowAddTask(false)} variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* <Card className="bg-gradient-hero border-primary/20 bg-muted/5">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setShowAddAppointment(true)}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Book Gig</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setShowAddTask(true)}
              >
                <Target className="h-6 w-6" />
                <span className="text-sm">Add Task</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Users className="h-6 w-6" />
                <span className="text-sm">New Client</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default Dashboard
