import Realm from 'realm';

// CONSTANTS
const USER_SCHEMA = 'user';
const AUTH_SCHEMA = 'auth';
const DRAFT_SCHEMA = 'draft';

const userSchema = {
  name: USER_SCHEMA,
  properties: {
    username: { type: 'string' },
    avatar: { type: 'string' },
    authType: { type: 'string' },
    postingKey: { type: 'string' },
    activeKey: { type: 'string' },
    memoKey: { type: 'string' },
    masterKey: { type: 'string' },
    accessToken: { type: 'string' },
  },
};

const draftSchema = {
  name: DRAFT_SCHEMA,
  properties: {
    title: { type: 'string' },
    tags: { type: 'string' },
    text: { type: 'string' },
    username: { type: 'string' },
  },
};

const authSchema = {
  name: AUTH_SCHEMA,
  properties: {
    isLoggedIn: { type: 'bool', default: false },
    pinCode: { type: 'string' },
    currentUsername: { type: 'string' },
  },
};

const realm = new Realm({ path: 'esteem.realm', schema: [userSchema, authSchema, draftSchema] });

// TODO: This is getting ALL user data, we should change this method with getUserDataWithUsername
export const getUserData = () => new Promise((resolve, reject) => {
  try {
    const user = Array.from(realm.objects(USER_SCHEMA));
    resolve(user);
  } catch (error) {
    reject(error);
  }
});

export const getUserDataWithUsername = (username) => {
  try {
    const user = Array.from(realm.objects(USER_SCHEMA).filtered('username = $0', username));
    return user;
  } catch (error) {
    return error;
  }
};

export const setUserData = userData => new Promise((resolve, reject) => {
  try {
    const account = getUserDataWithUsername(userData.username);

    if (account.length === 0) {
      realm.write(() => {
        realm.create(userSchema.name, userData);
        resolve(userData);
      });
    } else {
      resolve(userData);
    }
  } catch (error) {
    reject(error);
  }
});

export const updateUserData = userData => new Promise((resolve, reject) => {
  try {
    const account = realm.objects(USER_SCHEMA).filtered('username = $0', userData.username);

    if (Array.from(account).length > 0) {
      realm.write(() => {
        account[0].masterKey = userData.masterKey;
        account[0].activeKey = userData.activeKey;
        account[0].memoKey = userData.memoKey;
        account[0].postingKey = userData.postingKey;
        account[0].accessToken = userData.accessToken || '';
        resolve(userData);
      });
    } else {
      reject('User not found');
    }
  } catch (error) {
    reject(error);
  }
});

export const setDraftPost = (form, username) => new Promise((resolve, reject) => {
  try {
    const draft = realm.objects(DRAFT_SCHEMA).filtered('username = $0', username);
    realm.write(() => {
      if (Array.from(draft).length > 0) {
        draft[0].title = form.title;
        draft[0].tags = form.tags;
        draft[0].text = form.text;
        resolve(true);
      } else {
        realm.create(DRAFT_SCHEMA, {
          username,
          title: form.title,
          tags: form.tags,
          text: form.text,
        });
        resolve(true);
      }
    });
  } catch (error) {
    reject(error);
  }
});

export const getDraftPost = username => new Promise((resolve, reject) => {
  try {
    const draft = Array.from(realm.objects(DRAFT_SCHEMA).filtered('username = $0', username));
    resolve(draft[0]);
  } catch (error) {
    reject(error);
  }
});

// TODO: This method deleting ALL users. This should delete just a user.
export const removeUserData = () => new Promise((resolve, reject) => {
  setAuthStatus({ isLoggedIn: false }).then(() => {
    try {
      const accounts = realm.objects(USER_SCHEMA);
      realm.write(() => {
        realm.delete(accounts);
      });
      resolve();
    } catch (error) {
      alert(error);
      reject(error);
    }
  });
});

export const getAuthStatus = () => new Promise((resolve, reject) => {
  try {
    const auth = realm.objects(AUTH_SCHEMA);
    if (auth['0']) {
      resolve(auth['0']);
    } else {
      resolve(false);
    }
  } catch (error) {
    reject(error);
  }
});

export const setAuthStatus = authStatus => new Promise((resolve, reject) => {
  try {
    const auth = realm.objects(AUTH_SCHEMA);
    realm.write(() => {
      if (Array.from(auth).length > 0) {
        auth[0].isLoggedIn = authStatus.isLoggedIn;
        resolve(auth[0]);
      } else {
        realm.create(AUTH_SCHEMA, { ...authStatus, pinCode: '' });
        resolve(authStatus);
      }
    });
  } catch (error) {
    reject(error);
  }
});

export const updateCurrentUsername = username => new Promise((resolve, reject) => {
  try {
    const auth = realm.objects(AUTH_SCHEMA);
    realm.write(() => {
      if (Array.from(auth).length > 0) {
        auth[0].currentUsername = username;
        resolve(auth[0]);
      } else {
        const authData = {
          isLoggedIn: false,
          pinCode: '',
          currentUsername: username,
        };
        realm.create(AUTH_SCHEMA, { ...authData });
        resolve(authData);
      }
    });
  } catch (error) {
    reject(error);
  }
});

export const setPinCode = pinCode => new Promise((resolve, reject) => {
  try {
    const auth = realm.objects(AUTH_SCHEMA);

    realm.write(() => {
      auth[0].pinCode = pinCode;
      resolve(auth[0]);
    });
  } catch (error) {
    reject(error);
  }
});

export const getPinCode = () => new Promise((resolve, reject) => {
  try {
    const auth = realm.objects(AUTH_SCHEMA);
    if (auth[0]) {
      resolve(auth[0].pinCode);
    }
  } catch (error) {
    reject(error);
  }
});
