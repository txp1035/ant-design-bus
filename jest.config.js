module.exports = {
  // Jest应用于快照测试的快照序列化程序模块的路径列表
  snapshotSerializers: ['enzyme-to-json/serializer'],
  // Jest用来检测测试文件的regexp模式
  setupFiles: ['./tests/jest.setup.js'],
  setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'],
  // 在撰写报道报道时，Jest使用的记者姓名列表
  coverageReporters: ['html', 'text'],
  // 一个glob模式数组，指示应该为其收集覆盖率信息的一组文件
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**'],
  // 指示在执行测试时是否应收集覆盖率信息
  collectCoverage: true,
  // 模块使用的文件扩展名数组
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'mdx', 'node'],
  modulePaths: ['<rootDir>'],
  // 与所有测试路径匹配的regexp模式字符串数组，匹配的测试将被跳过
  testPathIgnorePatterns: ['/node_modules/'],
};
