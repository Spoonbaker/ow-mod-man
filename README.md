<!-- markdownlint-disable MD030 MD033 -->

# Outer Wilds Mod Manager

> **CURRENTLY A WORK IN PROGRESS!!**

<p align="center">
<img src="https://raw.githubusercontent.com/Bwc9876/ow-mod-man/main/owmods_gui/frontend/src/assets/images/logo.png" alt="OWMM Logo"/><br/>
This is the monorepo for the new <a href="https://www.mobiusdigitalgames.com/outer-wilds.html">Outer Wilds</a> Mod Manager.<br/>
<a href="owmods_core">Core</a><b> |</b>
<a href="owmods_cli">CLI</a><b> |</b>
<a href="owmods_gui">GUI</a>
</p>

## Packages

- [owmods_core](owmods_core): The core library, shared between the CLI and the GUI
- [owmods_cli](owmods_cli): The CLI interface for the manager, made with clap
- [owmods_gui](owmods_gui): The GUI interface for the manager, made with tauri

## Platform Support

| **Platform** |  **Supported** |
|:------------:|:--------------:|
| **Windows**  | ✅             |
| **Linux**    | ✅*            |
| **Deck**     | 🔜*            |

\* Quantum Space Buddies Currently Has Issues
