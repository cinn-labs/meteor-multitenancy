# Meteor Multitenancy
Divides the DB in groups for meteor apps.

**This package is under development, it is not recommended to use in production**

> This package doesn't use the standard multi-tenancy approach as others DBs do, it will only divide your data in differents groups


## How to use it?

### Setting up the user
After creating a user, you have to provide a group id for that user. It can be a companyId, teamId or any unique indentifier that you want.

```js
import { Tenancy } from 'meteor/cinn:multitenancy';

const companyId = Companies.insert({ name: 'New Company Name' });
const newUserId = Accounts.createUser({ email: 'email@email.com', profile: { name: 'John Doe' } });
Tenancy.setUserTenant(newUserId, companyId);
```

### Setting up the collection
After creating a collection, just call the `Tenancy.prepareCollection`, and the collection will be ready.
```js
import { Tenancy } from 'meteor/cinn:multitenancy';

const Posts = new Mongo.Collection('posts');
Tenancy.prepareCollection(Posts);
```

Every time that you insert a collection to the DB, this collection will be automatically in the current group.

Every time that you search a collection data, the result will only be from the current group of the current user.
```js
// Only returns the posts on the same current user's group, every query will be intercepted
Posts.find({});
```

### Getting user's group
```js
import { Tenancy } from 'meteor/cinn:multitenancy';

const groupId = Tenancy.currentGroupId(Meteor.userId());
```

## How it works?

It's pretty simples, it sets a `_groupId` field on every collection that is using the `Tenancy.prepareCollection`.
```js
// Basic setup
import { Tenancy } from 'meteor/cinn:multitenancy';

const Posts = new Mongo.Collection('posts');
Tenancy.prepareCollection(Posts);

// With a user setup and logged in
const postId = Posts.insert({ name: 'Name Test' });
const post = Posts.findOne({ _id: postId });
post._groupId === Tenancy.currentGroupId(Meteor.userId()); // Same group as the logged user
```

Every query that you run will be intercepted by the tenancy
```js
// With a user setup and logged in
const postId = Posts.insert({ name: 'Name Test' });
const post = Posts.find({}); 
// Only returns the posts in the same group as the current user's group
// Its doing the same thins as this: 
Posts.find({ _groupId: Tenancy.currentGroupId(Meteor.userId()) });
```

## Configurations

### Changing the group field name

By default the group field name is `_groupId` but you can set your own custom name:
```js
import { Tenancy } from 'meteor/cinn:multitenancy';

Tenancy.setGroupName('companyId');
```
