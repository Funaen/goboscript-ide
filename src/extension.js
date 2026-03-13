const vscode = require('vscode');

function activate(context) {
    // 出力チャネルを作成
    const outputChannel = vscode.window.createOutputChannel("goboscript Console");
    
    context.subscriptions.push(
        vscode.commands.registerCommand('gside.openStage', () => {
            // 1. Webview（ステージ）を「右側（Column Two）」に開く
            const panel = vscode.window.createWebviewPanel(
                'goboStage',
                'goboscript Stage',
                vscode.ViewColumn.Two,
                { 
                    enableScripts: true, 
                    localResourceRoots: [context.extensionUri],
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = getHtml(panel.webview, context.extensionUri);

            // 2. 出力パネルを「下」に表示させる
            // 第2引数の true は「フォーカスを奪わない（エディタに置いたままにする）」という意味です
            outputChannel.show(true); 

            // 3. Webviewからのログ転送
            panel.webview.onDidReceiveMessage(async msg => {
                ({
                    getFiles: async () => {
                        const files = await getProjectFiles();
                        panel.webview.postMessage({ command: 'getFilesRes', files: files });
                    },
                    log: () => {
                        outputChannel.appendLine(`[${msg.type}] ${msg.text}`);
                    },
                    builded: () => {
                        const sb3 = new Uint8Array(msg.file);
                        vscode.workspace.fs.writeFile(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'project.sb3'), sb3);
                    }
                })[msg.command]?.();
            });
        })
    );
}

async function getProjectFiles() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return {};

    const projectFiles = {};
    const rootUri = workspaceFolders[0].uri;

    // 開いている全ドキュメントをMap化（fileスキームのみ）
    const openedDocs = new Map(
        vscode.workspace.textDocuments
            .filter(doc => doc.uri.scheme === 'file')
            .map(doc => [doc.uri.toString(), doc])
    );

    async function readDirectory(uri) {
        const entries = await vscode.workspace.fs.readDirectory(uri);
        
        for (const [name, type] of entries) {
            const childUri = vscode.Uri.joinPath(uri, name);
            // 不要なディレクトリを除外
            if (['node_modules', '.git', 'media', 'dist', 'out'].includes(name)) continue;

            if (type === vscode.FileType.Directory) {
                await readDirectory(childUri);
            } else if (type === vscode.FileType.File) {
                const relativePath = vscode.workspace.asRelativePath(childUri, false);
                const uriStr = childUri.toString();

                if (openedDocs.has(uriStr)) {
                    // エディタのメモリ上のテキストを取得
                    const doc = openedDocs.get(uriStr);
                    // ★重要: 文字列をBuffer(Uint8Array)に正しく変換
                    projectFiles[relativePath] = Buffer.from(doc.getText());
                } else {
                    // ディスクから読み込み
                    projectFiles[relativePath] = await vscode.workspace.fs.readFile(childUri);
                }
            }
        }
    }

    await readDirectory(rootUri);
    return projectFiles;
}

function getHtml(webview, extensionUri) {
    const media = (f) => webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', ...f));
    return `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
       			<meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline' 'unsafe-eval' ${webview.cspSource}; connect-src ${webview.cspSource};">
                <script type="importmap">
					{
						"imports": {
							"goboscript": "${media(['goboscript', 'libgoboscript.js'])}",
							"Scaffolding": "${media(['scaffolding.js'])}"
						}
					}
				</script>
			</head>
			<body>
        		<button id="run">Play</button>
				<button id="stop">Stop</button>
                <button id="build">Build</button>
        		<div id="stage" style="width: 100%;aspect-ratio: 480 / 360;"></div>
				<script type="module" src="${media(['main.js'])}"></script>
    		</body>
		</html>`;
}

module.exports = { activate };