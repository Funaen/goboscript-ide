import * as goboscript from "goboscript";
import __wbg_init from "goboscript";
import "Scaffolding";
const vscode = acquireVsCodeApi();

class main {
	static init() {
		this.stage  = new Scaffolding.Scaffolding();
		this.stage.width = 480;
		this.stage.height = 360;
		this.stage.setup();
		this.attachDebugger(this.stage.vm);
		document.getElementById('run').onclick = () => this.onflag();
		document.getElementById('stop').onclick = () => this.stage.stopAll();
		document.getElementById('build').onclick = () => this.build();
		this.onflag();
	}
	static async onflag() {
		let builded;
		try {
			builded = await gscompiler.build();
		} catch (err) {
			vscode.postMessage({ command: 'log', text: err.message, type: 'error' });
		}
		try {
			const sb3 = await base64.decode(builded.file).arrayBuffer();
			await this.stage.loadProject(sb3);
			this.stage.appendTo(document.getElementById('stage'));
			this.stage.greenFlag();
		} catch (err) {
			vscode.postMessage({ command: 'log', text: err.message, type: 'error' });
		}
	}
	static async build () {
		vscode.postMessage({ command: 'builded', file: await base64.decode((await gscompiler.build()).file).arrayBuffer() });
	}
	static attachDebugger(vm) {
    	vm.runtime.addAddonBlock({
			procedureCode: "\u200B\u200Blog\u200B\u200B %s",
			arguments: ["content"],
			callback: ({content}) => {
				vscode.postMessage({ command: 'log', text: content.toString(), type: 'log' });
			}
		})
		vm.runtime.addAddonBlock({
			procedureCode: "\u200B\u200Bwarn\u200B\u200B %s",
			arguments: ["content"],
			callback: ({content}) => {
				vscode.postMessage({ command: 'log', text: content.toString(), type: 'warn' });
			}
		})
		vm.runtime.addAddonBlock({
			procedureCode: "\u200B\u200Berror\u200B\u200B %s",
			arguments: ["content"],
			callback: ({content}) => {
				vscode.postMessage({ command: 'log', text: content.toString(), type: 'error' });
			}
		})
	}
}

class gscompiler {
	static async build() {
		const files = await this.getFiles();
		await __wbg_init();
		goboscript.initialize();
		return goboscript.build(
			{
				files: Object.fromEntries(await Promise.all(Object.entries(files).map(
					async([path, {data, type}]) => ([
						`project/${path}`,
						{
							inner: await base64.encode(typeof data == "string" ? new Blob([data]) : data)
						}
					])
				)))
			}
		);
	}
	static getFiles() {
		vscode.postMessage({ command: 'getFiles' });
		return new Promise(resolve => {
			let handler = (event) => {
				if (event.data.command === 'getFilesRes'){
					window.removeEventListener('message', handler);
					resolve(event.data.files);
				}
			};
			window.addEventListener('message', handler);
		});
		
		/* {
			"stage.gs": `# This is the Stage, list more backdrops separated by comma.\ncostumes "blank.svg";\n`,
			"main.gs": `# This is a sprite.\ncostumes "blank.svg";\n\n# when green flag clicked\nonflag {\n  say "Hello, World!";\n}\n`,
			"blank.svg": `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="0" height="0" xmlns="http://www.w3.org/2000/svg"></svg>\n`,
			"goboscript.toml": `# goboscript project configuration\n\n# The target number of frames per second (FPS)\nframe_rate = 30\n\n# Maximum number of clones that can exist simultaneously\nmax_clones = 300.0\n\n# If true, removes various limits unrelated to clones or rendering\nno_miscellaneous_limits = false\n\n# If true, disables sprite fencing (sprites can move beyond stage borders)\nno_sprite_fencing = false\n\n# If true, enables frame interpolation for smoother animations\nframe_interpolation = false\n\n# If true, improves pen rendering quality (may affect performance)\nhigh_quality_pen = false\n\n# Width of the stage in pixels\nstage_width = 480\n\n# Height of the stage in pixels\nstage_height = 360\n`
		} */;
	}
}

class base64 {
	static encode(buffer) {
		return new Uint8Array(buffer).toBase64();
	}
	static decode(base64, mimeType = "application/octet-stream") {
		const bin = atob(base64);
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		return new Blob([bytes], {type: mimeType});
	}
};

main.init();