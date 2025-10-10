import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import AddAppointment from "@/components/home/Appoinments"
import AddTask from "@/components/home/tasks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Calendar,
  Plus,
  Users,
  Sparkles,
  CheckCircle2,
  Pen,
  Laugh
} from "lucide-react"

interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  completed: boolean
  created_at: string
  user_id: string
  updated_at: string
  description?: string
  status: string
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
  amount?: number
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [recentBookings, setRecentBookings] = useState<Appointment[]>([])
  const [monthlyEarnings, setMonthlyEarnings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
  
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
  
      // FETCH ALL TASKS
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
  
      // FETCH ALL APPOINTMENTS
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
  
      setTasks(tasksData || [])
      setAppointments(appointmentsData || [])
      setRecentBookings(appointmentsData || [])
  
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  
  
  

  const handleAddTask = async (taskData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in.",
        variant: "destructive"
      })
      return
    }
  
    try {
      // Clean the data - remove empty optional date fields
      const cleanedTaskData: any = {
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority,
        status: taskData.status,
        completed: taskData.completed,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
  
      // Only add optional fields if they have values
      if (taskData.assigned_to && taskData.assigned_to !== "") {
        cleanedTaskData.assigned_to = taskData.assigned_to
      }
  
      if (taskData.estimated_duration && taskData.estimated_duration !== "") {
        cleanedTaskData.estimated_duration = taskData.estimated_duration
      }
  
      if (taskData.task_type && taskData.task_type !== "") {
        cleanedTaskData.task_type = taskData.task_type
      }
  
      // Handle date fields
      if (taskData.start_date) {
        cleanedTaskData.start_date = taskData.start_date.toISOString()
      }
  
      if (taskData.due_date) {
        cleanedTaskData.due_date = taskData.due_date.toISOString()
      }
  
      const { data, error } = await supabase
        .from('tasks')
        .insert([cleanedTaskData])
        .select()
  
      if (error) throw error
  
      if (data && data[0]) {
        setShowAddTask(false)
        toast({
          title: "Success",
          description: "Task added successfully!"
        })
        fetchData() // Refresh all data
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error",
        description: "Failed to add task.",
        variant: "destructive"
      })
    }
  }
  

  const handleAddAppointment = async (appointmentData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in.",
        variant: "destructive"
      })
      return
    }
  
    try {
      const appointmentDate = appointmentData.appointment_date
      const appointmentTime = appointmentData.appointment_time
      
      if (!appointmentDate || !appointmentTime) {
        throw new Error("Date and time are required")
      }
  
      // Format date as YYYY-MM-DD
      let dateString: string
      if (appointmentDate instanceof Date) {
        const year = appointmentDate.getFullYear()
        const month = String(appointmentDate.getMonth() + 1).padStart(2, '0')
        const day = String(appointmentDate.getDate()).padStart(2, '0')
        dateString = `${year}-${month}-${day}`
      } else {
        dateString = appointmentDate
      }
  
      // Combine date and time
      const dateTimeString = `${dateString}T${appointmentTime}:00`
      const appointmentDateTime = new Date(dateTimeString)
  
      if (isNaN(appointmentDateTime.getTime())) {
        throw new Error("Invalid date or time format")
      }
  
      // Clean up the data
      const cleanedData: any = {
        client_name: appointmentData.client_name,
        client_email: appointmentData.client_email,
        client_phone: appointmentData.client_phone,
        service: appointmentData.service,
        appointment_date: dateString,
        appointment_time: appointmentDateTime.toISOString(),
        location: appointmentData.location,
        status: appointmentData.status || 'pending',
        payment_status: appointmentData.payment_status || 'unpaid',
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
  
      // Only add optional fields if they have actual values
      if (appointmentData.event_type && appointmentData.event_type !== "") {
        cleanedData.event_type = appointmentData.event_type
      }
      
      if (appointmentData.duration_estimate && appointmentData.duration_estimate !== "") {
        cleanedData.duration_estimate = appointmentData.duration_estimate
      }
      
      if (appointmentData.skin_type && appointmentData.skin_type !== "") {
        cleanedData.skin_type = appointmentData.skin_type
      }
      
      if (appointmentData.allergies_concerns && appointmentData.allergies_concerns !== "") {
        cleanedData.allergies_concerns = appointmentData.allergies_concerns
      }
      
      if (appointmentData.makeup_look_preference && appointmentData.makeup_look_preference !== "") {
        cleanedData.makeup_look_preference = appointmentData.makeup_look_preference
      }
      
      if (appointmentData.message && appointmentData.message !== "") {
        cleanedData.message = appointmentData.message
      }
  
      if (appointmentData.number_of_people && appointmentData.number_of_people !== "" && !isNaN(Number(appointmentData.number_of_people))) {
        cleanedData.number_of_people = Number(appointmentData.number_of_people)
      }
      
      if (appointmentData.amount && appointmentData.amount !== "" && !isNaN(Number(appointmentData.amount))) {
        cleanedData.amount = Number(appointmentData.amount)
      }
  
      console.log('Adding appointment with cleaned data:', cleanedData)
  
      const { data, error } = await supabase
        .from('appointments')
        .insert([cleanedData])
        .select()
  
      console.log('Appointment insert result:', { data, error })
  
      if (error) throw error
  
      if (data && data[0]) {
        setShowAddAppointment(false)
        toast({
          title: "Success",
          description: "Appointment added successfully!"
        })
        
        // Add appointment to state immediately (same as tasks)
        setAppointments(prev => [...prev, data[0] as Appointment])
        setRecentBookings(prev => [data[0] as Appointment, ...prev])
        
        // Also refresh from database
        await fetchData()
      }
    } catch (error: any) {
      console.error('Error adding appointment:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to add appointment.",
        variant: "destructive"
      })
    }
  }
  
  
  

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed, updated_at: new Date().toISOString() })
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
        description: "Failed to update task.",
        variant: "destructive"
      })
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
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
        description: "Failed to update appointment status.",
        variant: "destructive"
      })
    }
  }

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      if (isNaN(date.getTime())) return 'Invalid time'
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return 'Invalid time'
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
    <div className="min-h-screen bg-[#DB6C79]/10">
      <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold">Welcome back, Beautiful!</h1>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="hover:shadow-soft transition-all bg-yellow-200 w-full sm:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Appointments Today</CardTitle>
              <Calendar className="h-12 w-12" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {appointments.filter(a => a.status === 'confirmed').length} confirmed, {appointments.filter(a => a.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-all bg-pink-200 w-full sm:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Recent Bookings</CardTitle>
              <Users className="h-12 w-12" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Bookings in last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-all bg-blue-200 w-full sm:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Tasks Pending</CardTitle>
              <Pen className="h-12 w-12" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.filter(t => !t.completed && (t.priority === 'high' || t.priority === 'urgent')).length} high priority items
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-all bg-yellow-200 w-full sm:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Happy Earning!</CardTitle>
              <Laugh className="h-12 w-12" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{monthlyEarnings.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                Earnings in last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Appointments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-lg">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No appointments scheduled for today
                </p>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-foreground text-primary font-bold shrink-0">
                        {appointment.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0">
                        <p className="font-semibold text-sm">{appointment.client_name}</p>
                        <p className="text-xs text-muted-foreground">{appointment.service}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <Badge
                        className={`capitalize border-none text-xs font-semibold cursor-pointer
                          ${appointment.status === 'pending'
                            ? 'bg-yellow-400/20 text-yellow-600 dark:bg-yellow-400/30 dark:text-yellow-400'
                            : 'bg-green-400/20 text-green-600 dark:bg-green-400/30 dark:text-green-400'
                          }`}
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

              <Dialog open={showAddAppointment} onOpenChange={setShowAddAppointment}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Appointment</DialogTitle>
                    <DialogDescription>
                      Fill in the appointment details below
                    </DialogDescription>
                  </DialogHeader>
                  <AddAppointment onSubmit={handleAddAppointment} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-lg">Priority Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No tasks yet. Add your first task!
                </p>
              ) : (
                tasks.map((task) => (
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
                        ${task.priority === "high" || task.priority === "urgent"
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

              <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task to manage your workflow
                    </DialogDescription>
                  </DialogHeader>
                  <AddTask onSubmit={handleAddTask} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
