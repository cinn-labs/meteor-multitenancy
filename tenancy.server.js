import { Meteor } from 'meteor/meteor';
import Tenancy from './tenancy.common';

Meteor.publish('_groupId', function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find({ _id: this.userId }, { fields: { [Tenancy.groupName]: 1 } });
});

Tenancy.setUserTenant = function(userId, groupId) {
  Accounts.users.update(userId, { $set: { [Tenancy.groupName]: groupId } });
};

Tenancy.prepareCollection = function(collection) {
  collection.before.find(findHook);
  collection.before.findOne(findHook);
  collection.before.insert(insertHook);
  collection.before.upsert(upsertHook);
};

Meteor.users.before.find(findHook);

function insertHook(userId, doc) {
  const groupId = Tenancy.currentGroupId(userId);
  if(!groupId) return true;
  doc[Tenancy.groupName] = groupId;
}

function upsertHook(userId, selector, modifier, options) {
  const groupId = Tenancy.currentGroupId(userId);
  if(!groupId) return true;
  modifier.$set = modifier.$set || {};
  modifier.$set[Tenancy.groupName] = groupId;
}

function findHook(userId, selector, options) {
  const groupId = Tenancy.currentGroupId(userId);
  if(!groupId) return true;
  selector[Tenancy.groupName] = groupId;
}
