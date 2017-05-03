import { Meteor } from 'meteor/meteor';

Tenancy = {
  groupName: '_groupId',
};

Tenancy.setGroupName = (name) => Tenancy.groupName = name;

Tenancy.currentGroupId = function(userId) {
  const user = Meteor.users.findOne({ _id: userId }, { fields: { [Tenancy.groupName]: 1 } });
  if(!user) return false;
  return user[Tenancy.groupName];
};

// Empty funcion to simulate code on client, avoiding adding "if (Meteor.isServer)" on every call
Tenancy.prepareCollection = function() {};

export default Tenancy;
