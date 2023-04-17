export const gameFootageOpened =
    'user-activity.game-footage/open-game-footage-library';
export const gameFootageUploadOpened =
    'user-activity.game-footage/open-upload-form';
export const gameFootageUploadStarted =
    'user-activity.game-footage/start-upload';
export const gameFootageUploadCompleted =
    'user-activity.game-footage/upload-complete';
export const gameFootageWatchOnHover =
    'user-activity.game-footage/watch-footage';
export const gameFootageClickedTelestrate =
    'user-activity.game-footage/click-to-telestrate';
export const gameFootageSort = 'user-activity.game-footage/sort-footage';
export const gameFootagePageUnmounted = 'user-activity.game-footage/exit-page';
export const gameFootageDeleteVideo =
    'user-activity.game-footage/delete-footage';
export const gameFootageEditVideo = 'user-activity.game-footage/rename-footage';
export const subscribeMounted = 'user-activity.subscribe/open-subscribe-page';
export const subscribeGoToStripe =
    'user-activity.subscribe/click-through-to-stripe';
export const telestrationMounted =
    'user-activity.telestration/opened-telestration';
export const telestrationMaskClicked =
    'user-activity.telestration/clicked-mask-tool';
export const telestrationMaskAplied =
    'user-activity.telestration/applied-mask-to-field';
export const telestrationUndoMask = 'user-activity.telestration/undo-mask-tool';
export const telestrationSaveMask =
    'user-activity.telestration/save-mask-setting';
export const telestrationHaloClicked = 'user-activity.telestration/halo-click';
export const telestrationHaloAplied =
    'user-activity.telestration/applied-halo-to-field';
export const telestrationPolygonClicked =
    'user-activity.telestration/clicked-polygon-tool';
export const telestrationPolygonStartedDrawing =
    'user-activity.telestration/started-drawing-polygon';
export const telestrationPolygonFinishedDrawing =
    'user-activity.telestration/finished-drawing-polygon';
export const telestrationCircleClicked =
    'user-activity.telestration/clicked-circle';
export const telestrationCircleAplied =
    'user-activity.telestration/applied-circle-to-field';
export const telestrationLinkClicked =
    'user-activity.telestration/clicked-link-cursor';
export const telestrationLinkAdded =
    'user-activity.telestration/added-linked-cursor-to-field';
export const telestrationLinkFinished =
    'user-activity.telestration/finished-linked-cursor';
export const telestrationClickedUndo =
    'user-activity.telestration/clicked-undo';
export const telestrationRecordingStarted =
    'user-activity.telestration/started-recording';
export const telestrationRecordingFinished =
    'user-activity.telestration/finished-recording';
export const telestrationSavingStarted =
    'user-activity.telestration/start-saved-recording';
export const telestrationRecordingSavingCanceled =
    'user-activity.telestration/cancel-saved-recording';
export const telestrationRecordingSavingFinished =
    'user-activity.telestration/finish-saving-recording';
export const telestrationStraightArrowClicked =
    'user-activity.telestration/clicked-straight-arrow';
export const telestrationSegmentArrowClicked =
    'user-activity.telestration/clicked-segment-arrow';
export const telestrationClearClicked =
    'user-activity.telestration/clicked-clear';
export const telestrationHelpClicked =
    'user-activity.telestration/click-sidebar-help-button';

export type IUserEvents =
    | 'user-activity.game-footage/open-game-footage-library'
    | 'user-activity.game-footage/open-upload-form'
    | 'user-activity.game-footage/start-upload'
    | 'user-activity.game-footage/upload-complete'
    | 'user-activity.game-footage/watch-footage'
    | 'user-activity.game-footage/watch-footage'
    | 'user-activity.game-footage/click-to-telestrate'
    | 'user-activity.game-footage/sort-footage'
    | 'user-activity.game-footage/exit-page'
    | 'user-activity.game-footage/delete-footage'
    | 'user-activity.game-footage/rename-footage'
    | 'user-activity.subscribe/open-subscribe-page'
    | 'user-activity.subscribe/click-through-to-stripe'
    | 'user-activity.telestration/opened-telestration'
    | 'user-activity.telestration/clicked-mask-tool'
    | 'user-activity.telestration/applied-mask-to-field'
    | 'user-activity.telestration/undo-mask-tool'
    | 'user-activity.telestration/save-mask-setting'
    | 'user-activity.telestration/halo-click'
    | 'user-activity.telestration/applied-halo-to-field'
    | 'user-activity.telestration/clicked-polygon-tool'
    | 'user-activity.telestration/started-drawing-polygon'
    | 'user-activity.telestration/finished-drawing-polygon'
    | 'user-activity.telestration/clicked-circle'
    | 'user-activity.telestration/applied-circle-to-field'
    | 'user-activity.telestration/clicked-link-cursor'
    | 'user-activity.telestration/added-linked-cursor-to-field'
    | 'user-activity.telestration/finished-linked-cursor'
    | 'user-activity.telestration/clicked-undo'
    | 'user-activity.telestration/started-recording'
    | 'user-activity.telestration/finished-recording'
    | 'user-activity.telestration/start-saved-recording'
    | 'user-activity.telestration/cancel-saved-recording'
    | 'user-activity.telestration/finish-saving-recording'
    | 'user-activity.telestration/clicked-straight-arrow'
    | 'user-activity.telestration/clicked-straight-arrow'
    | 'user-activity.telestration/clicked-segment-arrow'
    | 'user-activity.telestration/clicked-clear'
    | 'user-activity.telestration/click-sidebar-help-button';
