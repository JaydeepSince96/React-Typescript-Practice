#!/usr/bin/env node
// Simple test script to verify the subtask analytics API

const testSubtaskAnalytics = async () => {
  const API_BASE_URL = 'http://localhost:3000/api';
  
  try {
    console.log('🧪 Testing Subtask Analytics API...\n');
    
    // Test with a sample task ID
    const taskId = 'sample-task-id';
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks/stats`);
    
    if (!response.ok) {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      return;
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API Response successful!');
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
    console.log('💡 Make sure the backend server is running on http://localhost:3000');
  }
};

// Run the test
testSubtaskAnalytics().then(() => {
  console.log('\n🏁 Test completed!');
});
