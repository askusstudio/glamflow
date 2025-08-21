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
        console.log('Tasks error:', tasksError)
        // Show sample data for demo purposes
        setTasks([
          { id: '1', title: "Restock foundation shades", priority: "high", completed: false, created_at: new Date().toISOString(), user_id: 'demo', updated_at: new Date().toISOString() },
          { id: '2', title: "Client consultation - Sarah", priority: "medium", completed: true, created_at: new Date().toISOString(), user_id: 'demo', updated_at: new Date().toISOString() },
          { id: '3', title: "Post Instagram reel", priority: "low", completed: false, created_at: new Date().toISOString(), user_id: 'demo', updated_at: new Date().toISOString() }
        ])
      } else {
        setTasks(tasksData as Task[] || [])
      }

      if (appointmentsError) {
        console.log('Appointments error:', appointmentsError)
        // Show sample data for demo purposes
        setAppointments([
          { id: '1', client_name: "Priya Sharma", service: "Bridal Makeup", appointment_time: new Date().toISOString(), status: "confirmed", created_at: new Date().toISOString(), user_id: 'demo', updated_at: new Date().toISOString() },
          { id: '2', client_name: "Meera Patel", service: "Hair Styling", appointment_time: new Date().toISOString(), status: "pending", created_at: new Date().toISOString(), user_id: 'demo', updated_at: new Date().toISOString() }
        ])
      } else {
        setAppointments(appointmentsData as Appointment[] || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Info",
        description: "Using demo data. Please implement authentication for full functionality.",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTaskTitle.trim(),
          priority: 'medium' as const,
          completed: false,
          user_id: 'dummy-user-id' // This should be auth.uid() when auth is implemented
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
      // Add to demo data for now
      const newTask: Task = {
        id: Math.random().toString(),
        title: newTaskTitle.trim(),
        priority: 'medium',
        completed: false,
        created_at: new Date().toISOString(),
        user_id: 'demo',
        updated_at: new Date().toISOString()
      }
      setTasks(prev => [newTask, ...prev])
      setNewTaskTitle('')
      setShowAddTask(false)
      toast({
        title: "Demo Mode",
        description: "Task added to demo data. Implement authentication for persistence.",
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
      // Update demo data
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      ))
      toast({
        title: "Demo Mode",
        description: `Task ${!completed ? 'completed' : 'reopened'} in demo mode.`
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

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...newAppointmentData,
          user_id: 'dummy-user-id', // This should be auth.uid() when auth is implemented
          status: 'pending' as const
        }])
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
      // Add to demo data
      const newAppointment: Appointment = {
        id: Math.random().toString(),
        ...newAppointmentData,
        status: 'pending',
        created_at: new Date().toISOString(),
        user_id: 'demo',
        updated_at: new Date().toISOString()
      }
      setAppointments(prev => [...prev, newAppointment])
      setNewAppointmentData({
        client_name: '',
        service: '',
        appointment_time: ''
      })
      setShowAddAppointment(false)
      toast({
        title: "Demo Mode",
        description: "Appointment added to demo data. Implement authentication for persistence.",
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
      // Update demo data
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      ))
      toast({
        title: "Demo Mode",
        description: `Appointment ${newStatus} in demo mode.`
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
      return '2:00 PM'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                GlamFlow
              </span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Button variant="ghost" className="bg-primary/10 text-primary">Dashboard</Button>
              <Button variant="ghost">Tasks</Button>
              <Button variant="ghost">Calendar</Button>
              <Button variant="ghost">Analytics</Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              size="sm" 
              className="bg-gradient-primary"
              onClick={() => setShowAddTask(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, Beautiful! ✨</h1>
          <p className="text-muted-foreground">Here's what's happening with your beauty business today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-soft transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{todayEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

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

          <Card className="hover:shadow-soft transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">of ₹{monthlyGoal.toLocaleString()} goal</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Appointments
              </CardTitle>
              <CardDescription>Your upcoming beauty sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.client_name}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={appointment.status === "confirmed" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => updateAppointmentStatus(appointment.id, appointment.status === 'confirmed' ? 'pending' : 'confirmed')}
                    >
                      {appointment.status}
                    </Badge>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(appointment.appointment_time)}
                    </div>
                  </div>
                </div>
              ))}
              
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Priority Tasks
              </CardTitle>
              <CardDescription>Your beauty business to-dos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <button onClick={() => toggleTask(task.id, task.completed)}>
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <div className="h-4 w-4 border-2 rounded-full"></div>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </p>
                  </div>
                  <Badge 
                    variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
              
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

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Goal Progress
            </CardTitle>
            <CardDescription>Track your earnings goal for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Current: ₹{todayEarnings.toLocaleString()}</span>
                <span>Goal: ₹{monthlyGoal.toLocaleString()}</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  You're doing great! Keep it up! 💄
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-hero border-primary/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </Card>
      </div>
    </div>
  )
}

export default Dashboard