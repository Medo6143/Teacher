import React, { useEffect } from 'react';
import { Users, DollarSign, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentStats, setLoading } from '../store/statsSlice';
import { statsService } from '../services/firebase';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const mockRevenueData = [
  { month: 'يناير', amount: 12000 },
  { month: 'فبراير', amount: 15000 },
  { month: 'مارس', amount: 18000 },
  { month: 'أبريل', amount: 14000 },
  { month: 'مايو', amount: 20000 },
  { month: 'يونيو', amount: 16000 },
];

const mockPaymentData = [
  { name: 'مدفوع', value: 70, color: '#10B981' },
  { name: 'معلق', value: 20, color: '#F59E0B' },
  { name: 'متأخر', value: 10, color: '#EF4444' },
];

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentStats, loading } = useAppSelector((state) => state.stats);
  const { currentMonth } = useAppSelector((state) => state.ui);
  const { students } = useAppSelector((state) => state.students);
  const { groups } = useAppSelector((state) => state.groups);
  const { payments } = useAppSelector((state) => state.payments);
  const { sessions } = useAppSelector((state) => state.sessions);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, currentMonth]);

  const loadStats = async () => {
    if (!user) return;
    
    dispatch(setLoading(true));
    try {
      const stats = await statsService.getMonthlyStats(user.uid, currentMonth);
      dispatch(setCurrentStats(stats));
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Calculate basic stats from current data
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalRevenue = payments.reduce((sum, p) => p.status === 'paid' ? sum + p.amount : sum, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const overduePayments = payments.filter(p => p.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ar-EG', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="الطلاب النشطين"
          value={activeStudents}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="إجمالي التحصيل"
          value={`${totalRevenue.toLocaleString()} جنيه`}
          icon={DollarSign}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="الحصص المكتملة"
          value={completedSessions}
          icon={Calendar}
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="المدفوعات المعلقة"
          value={pendingPayments + overduePayments}
          icon={AlertCircle}
          color={overduePayments > 0 ? "red" : "yellow"}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات الشهرية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} جنيه`, 'المبلغ']} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة المدفوعات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockPaymentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {mockPaymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center space-x-4 space-x-reverse">
            {mockPaymentData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ml-2`} style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="h-8 w-8 text-blue-600 ml-3" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">إضافة طالب جديد</p>
              <p className="text-xs text-gray-500">أضف طالب جديد للنظام</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <DollarSign className="h-8 w-8 text-green-600 ml-3" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">تسجيل دفعة</p>
              <p className="text-xs text-gray-500">سجل دفعة جديدة للطلاب</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Calendar className="h-8 w-8 text-purple-600 ml-3" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">جدولة حصة</p>
              <p className="text-xs text-gray-500">أضف حصة جديدة للجدول</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 ml-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">تم تسجيل دفعة جديدة من أحمد محمد</p>
              <p className="text-xs text-gray-500">منذ ساعتين</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-500 ml-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">تم إضافة طالب جديد: فاطمة أحمد</p>
              <p className="text-xs text-gray-500">منذ 4 ساعات</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-purple-500 ml-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">تم إكمال حصة مجموعة الرياضيات المتقدمة</p>
              <p className="text-xs text-gray-500">منذ 6 ساعات</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}