# AIDEN: Penetration Testing and Advanced Cyber Security Suite

<p align="center">
  <img width="160" src="./website/static/readme/aiden.png" alt="AIDEN logo" />
  <p align="center">🚀 Empower Your Cybersecurity: Explore, Secure, Defend.</p>
</p>

[![AIDEN downloads](https://img.shields.io/github/downloads/yourusername/AIDEN/total.svg?style=flat)](https://github.com/yourusername/AIDEN/releases) [![AIDEN](https://img.shields.io/badge/AIDEN-ethical_hacking-blue?style=flat&logo=github)](https://discord.gg/yourdiscord)

<a href="https://www.buymeacoffee.com/yourusername" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 145px !important;" ></a>

> [!NOTE]
> On first installation, some **AIDEN Extensions** may not be the latest. Please update extensions manually from [yourusername/AIDEN/extensions](https://github.com/yourusername/AIDEN/tree/main/extensions) using the AIDEN settings or by opening the local extensions directory: **Help -> AIDEN UserData -> Extensions**.
>
> ![](./website/static/readme/aiden-extensions.png)

## 🔥 Features

Introducing **AIDEN** – an AI-enhanced, customizable cybersecurity platform engineered to empower penetration testing, ethical hacking, and ITSECDEVOPS tasks:

- **Penetration Testing Tools**: Integrated vulnerability scanners, port scanners, network mappers, and more.
- **Advanced Cyber Security**: Real-time threat intelligence, anomaly detection, and automated defense strategies.
- **Ethical Hacking Modules**: Simulated attack scenarios, exploitation frameworks, and secure code analysis.
- **ITSECDEVOPS Integration**: Seamless automation of security deployments, compliance checks, and infrastructure monitoring.
- **Multi-Platform Support**: Designed for macOS, Windows, and Linux environments.
- **Extensibility**: Easily add custom plugins to enhance your security toolkit.

## ⬇️ Download

[🕒 Release History...](https://github.com/yourusername/AIDEN/releases)

- **macOS**
  - [⬇️ x64](https://github.com/yourusername/AIDEN/releases/download/vX.Y.Z/AIDEN_macos_x64_vX.Y.Z.dmg)
  - [⬇️ arm64](https://github.com/yourusername/AIDEN/releases/download/vX.Y.Z/AIDEN_macos_arm64_vX.Y.Z.dmg)
- **Windows**
  - [⬇️ x64](https://github.com/yourusername/AIDEN/releases/download/vX.Y.Z/AIDEN_win32_x64_vX.Y.Z_setup.exe)
- **Linux**
  - [⬇️ AppImage](https://github.com/yourusername/AIDEN/releases/download/vX.Y.Z/AIDEN_linux_vX.Y.Z.AppImage)
  - [⬇️ amd64.deb](https://github.com/yourusername/AIDEN/releases/download/vX.Y.Z/aiden_linux_amd64_vX.Y.Z.deb)

| Preview | Preview |
| --- | --- |
| ![AIDEN Dark Mode 1](./website/static/readme/aiden-theme-dark-1.png) | ![AIDEN Dark Mode 2](./website/static/readme/aiden-theme-dark-2.png) |
| ![AIDEN Light Mode 1](./website/static/readme/aiden-theme-light-1.png) | ![AIDEN Light Mode 2](./website/static/readme/aiden-theme-light-2.png) |
| ![AIDEN Settings](./website/static/readme/aiden-settings.png) | ![AIDEN Reports](./website/static/readme/aiden-reports.png) |

## ⚙️ AIDEN Configs

[📁 configs](./configs)

### AIDEN Mode

Customize your security operations by configuring scanning rules, threat detection policies, and ITSECDEVOPS workflows:

- **Step 1**: Open the settings (on macOS: `cmd`+`,`, on Windows: `ctrl`+`,`)
- **Step 2**: Update your vulnerability thresholds, scanning rules, or proxy configurations.
- **Step 3**: Click the `sync` button to apply the new settings.

![AIDEN Mode Sync](./website/static/configs/aiden-mode-sync.png)

#### aiden.mode.json

A sample configuration file structure:

```json
{
  "name": "AIDEN Security Suite",
  "version": "1.0.0",
  "sync": "https://raw.githubusercontent.com/yourusername/AIDEN/main/configs/aiden.mode.json",
  "modes": [
    {
      "id": "vuln-scan",
      "parent": "security",
      "text": "Vulnerability Scan",
      "url": "https://yourapi.example.com/vuln-scan",
      "dir": false
    },
    {
      "id": "threat-intel",
      "parent": "security",
      "text": "Threat Intelligence",
      "url": "https://yourapi.example.com/threat-intel",
      "dir": false
    }
  ]
}
