import { Meteor } from "meteor/meteor";
import Tenancy from "./tenancy.common";

Meteor.publish("_groupId", function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find(
    { _id: this.userId },
    { fields: { [Tenancy.groupName]: 1 } }
  );
});

Tenancy.setUserTenant = function (userId, groupId, callback) {
  Meteor.defer(() =>
    Meteor.users.update(
      { _id: userId },
      { $set: { [Tenancy.groupName]: groupId } },
      callback
    )
  );
};

Tenancy.insertHook = function (userId, doc) {
  const groupId = Tenancy.currentGroupId(userId);
  if (!groupId) return true;
  doc[Tenancy.groupName] = groupId;
};

Tenancy.upsertHook = function (userId, selector, modifier, options) {
  const groupId = Tenancy.currentGroupId(userId);
  if (!groupId) return true;
  modifier.$set = modifier.$set || {};
  modifier.$set[Tenancy.groupName] = groupId;
};

Tenancy.findHook = function (userId, selector, options) {
  const groupId = Tenancy.currentGroupId(userId);
  if (!groupId) return true;
  selector[Tenancy.groupName] = groupId;
};

Tenancy.prepareCollection = function (collection) {
  if (!collection.before)
    return console.warn(
      `[TENANCY] Collection ${collection._name} was not succesfully configured.`
    );
  collection.before.find(Tenancy.findHook);
  collection.before.findOne(Tenancy.findHook);
  collection.before.insert(Tenancy.insertHook);
  //collection.before.upsert(Tenancy.upsertHook);
};

if (!!Meteor.users) Meteor.users.before.find(Tenancy.findHook);
