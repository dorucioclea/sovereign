import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { timers } from '/lib/const';
import { ReactiveVar } from 'meteor/reactive-var';

import { Contracts } from '/imports/api/contracts/Contracts';
import { timeSince } from '/imports/ui/modules/chronos';

import './editor.html';
import './editorButton.js';
import './counter.js';

const _keepKeyboard = () => {
  $('#toolbar-hidden-keyboard').focus();
};

function toggle(key, value, id) {
  const obj = {};
  obj[key] = value;
  // Contracts.update(Session.get('contract')._id, { $set: obj });
  console.log(id);
  Contracts.update(id, { $set: obj });
}

Template.editor.onCreated(() => {
  Template.instance().contract = new ReactiveVar(Template.currentData().contract);
});

/**
Template.editor.onRendered(function () {
  @NOTE deprecated animation favoring integrated desktop and mobile UX
  if (!this.data.stage === 'DRAFT') {
    Session.set('newPostEditor', true);

    // smoke and mirrors
    $('#post-editor-topbar').css('opacity', 0);
    $('#post-editor').css('margin-top', `${$(window).height()}px`);
    $('#post-editor').css('display', '');
    $('#post-editor').velocity({ 'margin-top': '60px' }, {
      duration: timers.ANIMATION_DURATION,
      complete: () => {
        $('#titleContent').focus();
      },
    });
  }
});
*/

Template.editor.helpers({
  log() {
    return Session.get('mobileLog');
  },
  feedMode() {
    return Session.get('feedEditorMode');
  },
  sinceDate(timestamp) {
    return `${timeSince(timestamp)}`;
  },
  ballotEnabled() {
    return Template.instance().contract.get().ballotEnabled; // Session.get('contract').ballotEnabled;
  },
  menu() {
    const contract = Template.instance().contract.get();
    return [
      {
        icon: 'editor-ballot',
        status: () => {
          if (contract.ballotEnabled) { // Session.get('contract').ballotEnabled) {
            return 'active';
          }
          return 'enabled';
        },
        action() {
          toggle('ballotEnabled', !contract.ballotEnabled, contract._id); // !Session.get('contract').ballotEnabled);
        },
      },
    ];
  },
});

Template.editor.events({
  'click #close-mobile-editor'() {
    $('#post-editor').css('display', '');
    $('#post-editor').velocity({ 'margin-top': `${$(window).height()}px` }, {
      duration: timers.ANIMATION_DURATION,
      complete: () => {
        $('#post-editor').css('display', 'none');
        Session.set('newPostEditor', false);
        window.history.back();
      },
    });
  },
  'click .mobile-section'() {
    $('#titleContent').focus();
  },
});

export const keepKeyboard = _keepKeyboard;
