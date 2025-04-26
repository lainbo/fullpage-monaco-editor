import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [
    compression({
      algorithm: 'gzip', // 使用gzip压缩
      ext: '.gz', // 生成的文件后缀
      threshold: 10241, // 体积大于10KB的文件才会被压缩
    })
  ]
}); 
