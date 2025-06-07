# machine-vcode-ts

English | [简体中文](./README.md)

![Demo Image](./imgList/demo.jpeg)

A TypeScript-based CAPTCHA generation module that provides a simple, reliable, and easy-to-integrate verification solution.

## 🌟 Features

- 🚀 Developed with TypeScript, providing complete type support
- 🎨 Supports multiple CAPTCHA styles and custom configurations
- 🔒 Secure and reliable verification mechanism
- 🔧 Easy to integrate and use
- ⚡️ Built with Webpack 4 for stability
- 📦 Supports modular import
- 🛠 Provides complete development environment

## 📦 Project Structure

```
mlVocdeProject/
├── vcode/                # Frontend CAPTCHA module
│   ├── src/             # Source code directory
│   │   ├── api/        # API interfaces
│   │   ├── config/     # Configuration files
│   │   ├── enum/       # Enum definitions
│   │   ├── interface/  # Interface definitions
│   │   ├── static/     # Static resources
│   │   ├── utils/      # Utility functions
│   │   ├── main.ts     # Entry file
│   │   └── global.d.ts # Global type declarations
│   ├── webpack.config.js # Webpack configuration
│   └── tsconfig.json    # TypeScript configuration
└── server/              # Backend service
```

## 🚀 Quick Start

### Requirements

- Node.js >= 16.0.0
- Yarn >= 1.22.0

### Installation Steps

1. Clone the project
```bash
git clone git@github.com:mingle98/machine-vcode-ts.git
cd machine-vcode-ts
```

2. Install dependencies
```bash
cd mlVocdeProject/vcode
yarn install
```

3. Start development server
```bash
yarn serve
```
Server will start at http://localhost:3000

4. Build for production
```bash
yarn build
```

## 💻 Development Guide

### Development Commands

- `yarn serve`: Start development server
- `yarn build`: Build for production
- `yarn dev`: Start in development mode (without auto-opening browser)

### Directory Structure

- `src/api`: API interface encapsulation
- `src/config`: Project configuration files
- `src/enum`: Enum type definitions
- `src/interface`: TypeScript interface definitions
- `src/static`: Static resource files
- `src/utils`: Utility function collection

### Configuration Files

- `webpack.config.js`: Webpack build configuration
- `tsconfig.json`: TypeScript compilation configuration
- `tslint.json`: TypeScript code standard configuration

## 🔧 Usage

### Basic Usage

1. Import the built file:
```html
<script src="path/to/api/built.js"></script>
```

**Note**: If you want to use the online built.js, please refer to this documentation: [https://luckycola.com.cn/public/docs/shares/sdk/ml-vcodes.html](https://luckycola.com.cn/public/docs/shares/sdk/ml-vcodes.html)

2. Initialize CAPTCHA:
```html
<div id="myVcodeContainer"></div>
<script>
window.onload = function() {
    const mlVcode = boostrapFn({
        // CAPTCHA type: supports click verification(clickVcode), rotate verification(roateVcode), and puzzle verification(puzzleVcode)
        vcodeType: ['puzzleVcode', 'clickVcode', 'roateVcode'],
        // Mode: dialog(popup mode) or empty(embedded mode)
        mode: 'dialog',
        // CAPTCHA container ID
        container: '#myVcodeContainer',
        // Enable server verification (default false)
        serverVerify: false,
        // Success callback
        successFn: (rsp) => {
            console.log('Verification successful');
        },
        // Failure callback
        failFn: (rsp) => {
            console.log('Verification failed');
        }
    }).render();
}
</script>
```

### Advanced Configuration

#### Click CAPTCHA Configuration
```javascript
clickVcodeConfig: {
    // CAPTCHA text
    fontList: 'abcdefghijklmnopqrstuvwxyz',
    // Background image list (URL array)
    imgList: []
}
```

#### Puzzle CAPTCHA Configuration
```javascript
puzzleVcodeConfig: {
    // Puzzle shape: 'puzzle' | 'rect' | 'round' | 'triangle'
    puZshape: 'puzzle',
    // Operation tip
    puZoperateTip: 'Please drag to complete the puzzle',
    // Background image list (URL array)
    puZimgList: []
}
```

#### Rotate CAPTCHA Configuration
```javascript
roateVcodeConfig: {
    // Operation tip
    roateOperateTip: 'Please drag to rotate the image upright',
    // Image list (URL array)
    roateimgList: []
}
```

#### Custom Interface Text
```javascript
customTxt: {
    // Header configuration
    headerConfig: {
        text: 'Security Verification',
        url: 'https://your-website.com'
    },
    // Footer configuration
    footerConfig: {
        text: 'About Us',
        url: 'https://your-website.com/about'
    }
}
```

### Server Verification Configuration

If server verification is needed (serverVerify = true), you can customize the verification interface through the following configuration:

```javascript
collectionDataOptios: {
    // Enable custom server verification interface
    open: true,
    // Data reporting interface (POST)
    postUrl: '/api/mlvcode',
    // Data reporting callback
    postUrlFn: function(resData) {
        console.log('Data reporting response:', resData);
    },
    // Initialization interface (POST)
    initpostUrl: '/api/initmlvcode',
    // Initialization interface callback
    postInitUrlFn: function(initSuccessHook, resData) {
        if (resData.data.code === 0) {
            initSuccessHook();
        }
    },
    // Verification interface (POST)
    verifypostUrl: '/api/verify',
    // Verification interface callback
    verifypostUrlFn: function(resData, verifySuccessHook, verifyFailHook) {
        if (resData.data.code === 0) {
            verifySuccessHook();
        } else {
            verifyFailHook();
        }
    },
    // Request parameter pre-processing
    apiDataPreFn: function(apiData) {
        // You can encrypt request parameters here
        return apiData;
    }
}
```

### Online Demo

Visit [Online Demo](http://demo.luckycola.com.cn/mlvcode/index.html) to see the CAPTCHA in action.

## 🤝 Contributing

We welcome community contributions! If you'd like to contribute to the project, please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Before Contributing

- Ensure code complies with TypeScript standards
- Add necessary comments and documentation
- Ensure all tests pass
- Follow existing code style

## 📝 Version History

- v1.0.0 - Initial Release
  - Basic CAPTCHA generation functionality
  - TypeScript support
  - Webpack 4 build support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details