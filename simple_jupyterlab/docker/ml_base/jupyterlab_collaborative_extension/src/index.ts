import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { Dialog, showDialog } from '@jupyterlab/apputils';
// import {
//   SessionContext,
//   ISessionContext,
//   sessionContextDialogs
// } from '@jupyterlab/apputils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { buildIcon, /*runIcon*/ } from '@jupyterlab/ui-components';
import { Menu } from '@lumino/widgets';

// import { ServiceManager } from '@jupyterlab/services';

namespace CollabCommandsID {
  export const goPersonal = 'collaborative:to-personal-notebook';
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'context-menu',
  autoStart: true,
  requires: [IFileBrowserFactory, IMainMenu],
  optional: [],
  activate: (
    app: JupyterFrontEnd,
    factory: IFileBrowserFactory,
    mainMenu: IMainMenu
  ) => {
    // const manager = app.serviceManager;
    const { commands, shell } = app;

    console.log(shell.title);

    // add menu tab
    const collaborativeMenu = new Menu({ commands });
    collaborativeMenu.title.label = 'Collaborative Jupyter';

    mainMenu.addMenu(collaborativeMenu, {rank: 0});

    commands.addCommand(CollabCommandsID.goPersonal, {
      label: 'Go to personal Jupyter instance',
      caption: 'Go to personal Jupyter instance',
      execute: () => {
        document.location.href =
          window.location.protocol +
          '//' +
          window.location.hostname +
          ':8888/hub/home';
      }
    });

    const command = CollabCommandsID.goPersonal;
    collaborativeMenu.addItem({ command });

    console.log(app.serviceManager.sessions);

    // this._sessionContext = new SessionContext({
    //   sessionManager: manager.sessions,
    //   specsManager: manager.kernelspecs,
    //   name: 'Extension Examples'
    // });

    // app.docRegistry.addFileType({
    //   name: 'collaborate',
    //   icon: runIcon,
    //   displayName: 'Collaborate notebook',
    //   extensions: ['.collaborate'],
    //   fileFormat: 'json',
    //   contentType: 'notebook',
    //   mimeTypes: ['application/x-ipynb+json']
    // });

    app.commands.addCommand('jlab-collab/context-menu:open', {
      label: 'Collaborate',
      caption: 'Start the notebook to collaborate...',
      icon: buildIcon,
      execute: () => {
        const file = factory.tracker.currentWidget.selectedItems().next();

        app.serviceManager.sessions.refreshRunning().then(() => {
          console.log(app.serviceManager.sessions.running());
          let sessions = app.serviceManager.sessions.running();
          let curSession = sessions.next();
          while (curSession !== undefined) {
            if (curSession.name == file.name && curSession.path == file.path) {
              console.log('SESSION FOUND', curSession);
              break;
            }
            curSession = sessions.next();
          }
          if (curSession !== undefined) {
            app.commands.execute('docmanager:open', {
              path: file.path,
              kernel: { id: curSession.kernel.id, name: curSession.kernel.name},
            });
          } else {
            showDialog({
              title: "Collaborate on "+ file.name,
              body: 'You need to wait for session to start...',
              buttons: [Dialog.okButton()]
            }).catch(e => console.log(e));
          }
        });

        // app.serviceManager.kernelspecs.refreshSpecs().then(() => {
        //   console.log(app.serviceManager.kernelspecs.specs);
        // });
      }
    });

    app.contextMenu.addItem({
      command: 'jlab-collab/context-menu:open',
      selector: '.jp-DirListing-item[data-file-type="notebook"]',
      rank: 0
    });
  }
};

export default extension;
