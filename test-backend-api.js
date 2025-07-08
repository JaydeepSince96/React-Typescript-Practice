// Test script to check if the new getTaskById API works
const testTaskById = async () => {
  const API_BASE_URL = 'http://localhost:3000/api';
  
  console.log('🧪 Testing getTaskById API...\n');
  
  // Test with a valid-looking MongoDB ObjectId
  const testTaskId = '686b9953a8cabadcb22881fc';
  
  try {
    const response = await fetch(`${API_BASE_URL}/task/${testTaskId}`);
    
    console.log(`📡 GET /api/task/${testTaskId}`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error Response: ${errorText}`);
      return;
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API Response successful!');
      console.log('📋 Task Data:');
      console.log(`   ID: ${result.data._id}`);
      console.log(`   Title: ${result.data.title}`);
      console.log(`   Completed: ${result.data.completed}`);
      console.log(`   Label: ${result.data.label}`);
      console.log(`   Created: ${result.data.createdAt}`);
    } else {
      console.log(`❌ API returned error: ${result.message}`);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

// Also test the subtask stats API
const testSubtaskStats = async () => {
  const API_BASE_URL = 'http://localhost:3000/api';
  const testTaskId = '686b9953a8cabadcb22881fc';
  
  console.log('\n🧪 Testing subtask stats API...\n');
  
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${testTaskId}/subtasks/stats`);
    
    console.log(`📡 GET /api/tasks/${testTaskId}/subtasks/stats`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error Response: ${errorText}`);
      return;
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Subtask Stats API successful!');
      console.log('📊 Subtask Statistics:');
      console.log(`   Total: ${result.data.total}`);
      console.log(`   Completed: ${result.data.completed}`);
      console.log(`   Pending: ${result.data.pending}`);
      console.log(`   Completion Rate: ${result.data.completionRate.toFixed(1)}%`);
    } else {
      console.log(`❌ API returned error: ${result.message}`);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

// Run both tests
Promise.all([
  testTaskById(),
  testSubtaskStats()
]).then(() => {
  console.log('\n🏁 API Tests completed!');
  console.log('\n💡 If you see 404 errors, it means the task ID doesn\'t exist in your database.');
  console.log('   Try creating a task first, or check your database for existing task IDs.');
});
