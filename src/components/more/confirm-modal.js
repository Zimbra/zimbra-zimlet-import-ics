import { createElement } from 'preact';
import { Text } from 'preact-i18n';

import { withIntl } from '../../enhancers';
import { ModalDialog } from '@zimbra-client/components';

const ConfirmModal = ({ onClose, onAction, zimletStrings }) => {
	return (
		<ModalDialog
			title={zimletStrings.menuItem}
			onAction={onAction}
			onClose={onClose}
			actionLabel="buttons.ok"
		>
			<p>
				{zimletStrings.modalText}<br /><br />
				<input type="file" id="zimbraZimletICSUpload" name="fileUpload" size="23" accept="text/calendar" />
			</p>
		</ModalDialog>
	);
};

export default withIntl()(ConfirmModal);
