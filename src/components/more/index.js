import { createElement } from 'preact';
import { useContext, useCallback } from 'preact/hooks';
import { Text, IntlContext } from 'preact-i18n';
import { compose } from 'recompose';
import { withIntl } from '../../enhancers';
import { ActionMenuItem } from '@zimbra-client/components';
import ConfirmModal from './confirm-modal';
import { callWith } from '@zimbra-client/util';

function createMore(props, context) {
   const { intl } = useContext(IntlContext);
   const zimletStrings = intl.dictionary['zimbra-zimlet-import-ics'];
   const importFromAttachmentHandler = useCallback(() => {
      importFromAttachment(props, context, zimletStrings)
   }, [props, context, zimletStrings]);
   const importFromCalendarMenuHandler = useCallback(() => {
      importFromCalendarMenu(props, context, zimletStrings)
   }, [props, context, zimletStrings]);

   if (props.attachment) {
      if (props.attachment.contentType === "text/calendar") {
         return (<div class="zimbra-client_attachment-grid_buttonContainer"><button onClick={importFromAttachmentHandler} type="button" class="blocks_button_button blocks_button_regular zimbra-client_attachment-grid_button"><span role="img" class="zimbra-icon zimbra-icon-download blocks_icon_md"></span><Text id='zimbra-zimlet-import-ics.saveToCalendar' /></button></div>);
      }
      else {
         return;
      }
   }
   else {
      return (
         <ActionMenuItem onClick={importFromCalendarMenuHandler}>
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
function removeModal(context) {
   const { dispatch } = context.store;
   dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal' }));
}

function handleUpload(args, e) {
   const context = args[0];
   const zimletStrings = args[1];
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

function importFromCalendarMenu(props, context, zimletStrings) {
   const modal = (
      <ConfirmModal
         onClose={callWith(removeModal, context)}
         onAction={callWith(handleUpload, [context, zimletStrings])}
         zimletStrings={zimletStrings}
      />
   );
   const { dispatch } = context.store;
   dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'addEventModal', modal: modal }));
}

export default compose(withIntl())(createMore)
