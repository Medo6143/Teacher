import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  setStudents, 
  setSearchTerm, 
  setStatusFilter, 
  setGroupFilter,
  setLoading,
  addStudent,
  updateStudent,
  deleteStudent
} from '../store/studentsSlice';
import { studentsService } from '../services/firebase';

export default function Students() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { students, loading, searchTerm, statusFilter, groupFilter } = useAppSelector((state) => state.students);
  const { groups } = useAppSelector((state) => state.groups);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadStudents();
    }
  }, [user]);

  const loadStudents = async () => {
    if (!user) return;
    
    dispatch(setLoading(true));
    try {
      const studentsData = await studentsService.getStudents(user.uid);
      dispatch(setStudents(studentsData));
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesGroup = !groupFilter || student.groupId === groupFilter;
    
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleAddStudent = async (studentData: any) => {
    if (!user) return;

    try {
      const id = await studentsService.addStudent({
        ...studentData,
        ownerUid: user.uid,
      });
      
      const newStudent = {
        id,
        ...studentData,
        ownerUid: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch(addStudent(newStudent));
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleUpdateStudent = async (studentData: any) => {
    if (!editingStudent) return;

    try {
      await studentsService.updateStudent(editingStudent.id, studentData);
      dispatch(updateStudent({ ...editingStudent, ...studentData }));
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;

    try {
      await studentsService.deleteStudent(studentId);
      dispatch(deleteStudent(studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const getGroupName = (groupId?: string) => {
    if (!groupId) return 'غير مجدول';
    const group = groups.find(g => g.id === groupId);
    return group?.name || 'مجموعة محذوفة';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'graduated': return 'خريج';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">الطلاب</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 ml-2" />
          إضافة طالب
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الطلاب..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="graduated">خريج</option>
          </select>

          <select
            value={groupFilter}
            onChange={(e) => dispatch(setGroupFilter(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">كل المجموعات</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">جاري تحميل الطلاب...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {students.length === 0 ? 'لا يوجد طلاب مضافين بعد' : 'لا توجد نتائج للبحث'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المجموعة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التواصل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        {student.email && (
                          <div className="text-sm text-gray-500">{student.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {getGroupName(student.groupId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2 space-x-reverse">
                        {student.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 ml-1" />
                            {student.phone}
                          </div>
                        )}
                        {student.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 ml-1" />
                            {student.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal would go here */}
      {(showAddModal || editingStudent) && (
        <StudentModal
          student={editingStudent}
          groups={groups}
          onSave={editingStudent ? handleUpdateStudent : handleAddStudent}
          onClose={() => {
            setShowAddModal(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}

// Student Modal Component
function StudentModal({ student, groups, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    parentPhone: student?.parentPhone || '',
    address: student?.address || '',
    groupId: student?.groupId || '',
    status: student?.status || 'active',
    customPaymentAmount: student?.customPaymentAmount || '',
    notes: student?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      customPaymentAmount: formData.customPaymentAmount ? Number(formData.customPaymentAmount) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {student ? 'تعديل الطالب' : 'إضافة طالب جديد'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">الاسم *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">رقم هاتف ولي الأمر</label>
            <input
              type="tel"
              value={formData.parentPhone}
              onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">المجموعة</label>
            <select
              value={formData.groupId}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر المجموعة</option>
              {groups.map((group: any) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">الحالة</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="graduated">خريج</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">قيمة مخصصة للدفع (جنيه)</label>
            <input
              type="number"
              value={formData.customPaymentAmount}
              onChange={(e) => setFormData({ ...formData, customPaymentAmount: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="اتركه فارغاً لاستخدام القيمة الافتراضية"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {student ? 'حفظ التعديلات' : 'إضافة الطالب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}