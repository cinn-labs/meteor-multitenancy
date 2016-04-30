import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

Tracker.autorun(function () {
  Meteor.subscribe('_groupId');
});
