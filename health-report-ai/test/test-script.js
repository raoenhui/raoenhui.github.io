// AI体检报告解读系统 - 功能测试脚本（文本输入版）
// 测试纯前端版本的核心功能

console.log('🚀 AI体检报告解读系统 - 功能测试开始（文本输入版）');

// 测试1: 检查核心函数是否存在
console.log('\n📋 测试1: 核心函数检查');
const requiredFunctions = [
    'getFormData',
    'generatePromptContent',
    'callDeepSeekAPI',
    'parseAIResponse',
    'getMockAnalysisResult',
    'displayAnalysisResult',
    'handleReportContentInput',
    'updateAnalyzeButtonState'
];

let allFunctionsExist = true;
requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName} 函数存在`);
    } else {
        console.log(`❌ ${funcName} 函数不存在`);
        allFunctionsExist = false;
    }
});

// 测试2: 表单数据处理测试
console.log('\n📋 测试2: 表单数据处理');
try {
    const formData = window.getFormData();
    console.log('✅ 表单数据处理函数正常');
    console.log('   表单数据结构:', Object.keys(formData));
    console.log('   包含体检报告内容字段:', 'reportContent' in formData);
} catch (error) {
    console.log(`❌ 表单数据处理失败: ${error.message}`);
}

// 测试3: 模拟数据分析测试
console.log('\n📋 测试3: 模拟数据分析');
try {
    const mockResult = window.getMockAnalysisResult();
    console.log('✅ 模拟数据分析正常');
    console.log('   异常指标数量:', mockResult.analysis?.abnormalItems?.length || 0);
    console.log('   健康服务推荐数量:', mockResult.services?.length || 0);
} catch (error) {
    console.log(`❌ 模拟数据分析失败: ${error.message}`);
}

// 测试4: API配置检查
console.log('\n📋 测试4: API配置检查');
if (window.DEEPSEEK_API_KEY && window.DEEPSEEK_API_KEY !== 'your-api-key-here') {
    console.log('✅ DeepSeek API密钥已配置');
} else {
    console.log('⚠️ DeepSeek API密钥需要配置');
}

if (window.DEEPSEEK_API_URL) {
    console.log('✅ DeepSeek API URL已配置:', window.DEEPSEEK_API_URL);
} else {
    console.log('❌ DeepSeek API URL未配置');
}

// 测试5: 错误处理测试
console.log('\n📋 测试5: 错误处理能力');
try {
    // 测试JSON解析错误处理
    const invalidJson = 'invalid json';
    const result = window.parseAIResponse(invalidJson);
    console.log('✅ 错误处理正常，返回模拟结果');
} catch (error) {
    console.log(`❌ 错误处理失败: ${error.message}`);
}

// 测试6: 按钮状态更新测试
console.log('\n📋 测试6: 按钮状态更新');
try {
    // 模拟文本输入
    const textarea = document.getElementById('reportContent');
    if (textarea) {
        textarea.value = '测试体检报告内容';
        window.updateAnalyzeButtonState();
        const analyzeBtn = document.getElementById('analyzeBtn');
        console.log('✅ 按钮状态更新测试完成');
        console.log('   按钮禁用状态:', analyzeBtn.disabled);
    } else {
        console.log('⚠️ 无法找到文本输入框，跳过按钮状态测试');
    }
} catch (error) {
    console.log(`❌ 按钮状态更新测试失败: ${error.message}`);
}

// 总结
console.log('\n🎯 测试总结:');
if (allFunctionsExist) {
    console.log('✅ 所有核心函数都存在');
} else {
    console.log('❌ 部分核心函数缺失');
}

console.log('\n📝 使用说明:');
console.log('1. 打开 health-report-ai/frontend/index.html 文件');
console.log('2. 在文本框中输入体检报告内容');
console.log('3. 填写健康信息表单（可选）');
console.log('4. 点击"开始AI分析解读"按钮');
console.log('5. 查看生成的医学解读报告');

console.log('\n🔧 注意事项:');
console.log('- 确保DeepSeek API密钥正确配置');
console.log('- 浏览器需要支持现代JavaScript特性');
console.log('- 可能需要处理CORS跨域问题');
console.log('- 文本输入需要包含体检报告内容才能进行分析');

console.log('\n✅ AI体检报告解读系统 - 功能测试完成（文本输入版）');