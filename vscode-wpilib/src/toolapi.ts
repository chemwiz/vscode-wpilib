'use scrict';
import * as vscode from 'vscode';
import { IToolAPI, IToolRunner } from 'vscode-wpilibapi';

interface IToolQuickPick extends vscode.QuickPickItem {
  runner: IToolRunner;
}

// The tools API provider. Lists tools added to it in a quick pick to select.
export class ToolAPI implements IToolAPI {
  private tools: IToolQuickPick[] = [];
  private disposables: vscode.Disposable[] = [];

  public async startTool(): Promise<boolean> {
    if (this.tools.length <= 0) {
      vscode.window.showErrorMessage('No tools found. Please install some');
      return false;
    }

    const result = await vscode.window.showQuickPick(this.tools, { placeHolder: 'Pick a tool' });

    if (result === undefined) {
      vscode.window.showInformationMessage('Tool run canceled');
      return false;
    }

    const ret =  result.runner.runTool();
    if (!ret) {
      await vscode.window.showInformationMessage(`Failed to start tool: ${result.runner.getDisplayName()}`);
    }
    return ret;
  }
  public addTool(tool: IToolRunner): void {
    const qpi: IToolQuickPick = {
      description: tool.getDescription(),
      label: tool.getDisplayName(),
      runner: tool,
    };
    this.tools.push(qpi);
  }

  public dispose() {
    for (const d of this.disposables) {
      d.dispose();
    }
  }
}
