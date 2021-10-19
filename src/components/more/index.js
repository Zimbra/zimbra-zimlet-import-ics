import { createElement } from 'preact';
import { useContext } from 'preact/hooks';
import { Text, IntlContext } from 'preact-i18n';
import { compose } from 'recompose';
import { withIntl } from '../../enhancers';
import { ModalDialog, ActionMenuItem } from '@zimbra-client/components';
import style from './style';

function createMore(props, context) {
   const { intl } = useContext(IntlContext);
   const zimletStrings = intl.dictionary['zimbra-zimlet-import-ics'];
   if (props.attachment) {
      if (props.attachment.contentType === "text/calendar") {
         return (<div class="zimbra-client_attachment-grid_buttonContainer"><button onClick={e => importFromAttachment(props, context, zimletStrings)} type="button" class="blocks_button_button blocks_button_regular zimbra-client_attachment-grid_button"><span role="img" class="zimbra-icon zimbra-icon-download blocks_icon_md"></span><Text id='zimbra-zimlet-import-ics.saveToCalendar' /></button></div>);
      }
      else {
         return;
      }
   }
   else {
      return (
         <ActionMenuItem onClick={e => handleClick(props, context, zimletStrings)}>
            <Text id='zimbra-zimlet-import-ics.menuItem' />
         </ActionMenuItem>
      );
   }
}

function importFromAttachment(props, context, zimletStrings) {
   fetch(props.attachment.url)
      .then(res => res.blob())
      .then(blob => {
         const file = new File([blob], "event.ics");
         const request = new XMLHttpRequest();
         const formData = new FormData();

         formData.append("file", file);
         request.open("POST", `/home/${context.getAccount().name}/Calendar?fmt=ics&charset=UTF-8`);

         request.onreadystatechange = function (e) {
            if ((request.readyState === 4) && (request.status === 200)) {
               alert(context, zimletStrings.complete);
               props.closeModal();
            }
         }
         request.send(formData);
      });
}

//implements closing of the dialog
function handleClose(context) {
   const { dispatch } = context.store;
   dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal' }));
}

function handleUpload(context, zimletStrings) {

   let file = window.parent.document.getElementById('zimbraZimletICSUpload').files[0];  // file from input
   let request = new XMLHttpRequest();
   let formData = new FormData();

   formData.append("file", file);
   request.open("POST", `/home/${context.getAccount().name}/Calendar?fmt=ics&charset=UTF-8`);

   request.onreadystatechange = function (e) {
      if ((request.readyState === 4) && (request.status === 200)) {
         const { dispatch } = context.store;
         dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal' }));
         alert(context, zimletStrings.completeReload);
      }
   }
   request.send(formData);

}

/* Method to display a toaster to the user */
function alert(context, message) {
   const { dispatch } = context.store;
   dispatch(context.zimletRedux.actions.notifications.notify({
      message: message
   }));
}

function handleClick(props, context, zimletStrings) {
   const modal = (
      <ModalDialog
         class={style.modalDialog}
         contentClass={style.modalContent}
         innerClass={style.inner}
         onClose={handleClose}
         cancelButton={false}
         header={false}
         footer={false}
      >
         <header class="zimbra-client_modal-dialog_header"><h2>{zimletStrings.menuItem}</h2><button onClick={e => handleClose(context)} aria-label="Close" class="zimbra-client_close-button_close zimbra-client_modal-dialog_actionButton"><span role="img" class="zimbra-icon zimbra-icon-close blocks_icon_md"></span></button></header>
         <div class="zimbra-client_modal-dialog_content zimbra-client_language-modal_languageModalContent">
            {zimletStrings.modalText}<br /><br />
            <input type="file" id="zimbraZimletICSUpload" name="fileUpload" size="23" accept="text/calendar" />
         </div>
         <footer class="zimbra-client_modal-dialog_footer"><button type="button" class="blocks_button_button blocks_button_primary blocks_button_regular blocks_button_brand-primary" onClick={e => handleUpload(context, zimletStrings)}><Text id="buttons.ok" /></button><button type="button" class="blocks_button_button blocks_button_regular" onClick={e => handleClose(context)}><Text id="buttons.cancel" /></button></footer>
      </ModalDialog>
   );

   const { dispatch } = context.store;
   dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal', modal: modal }));
}

export default compose(withIntl())(createMore)
