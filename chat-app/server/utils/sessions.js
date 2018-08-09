class Sessions {
  constructor() {
    this._byId = {}
  }

  addSession({ id, name, room }) {
    this._byId[id] = Object.freeze({ id, name, room })
  }

  removeSession(id) {
    const session = this._byId[id]
    delete this._byId[id]
    return session
  }

  getSession(id) {
    return this._byId[id]
  }

  getNames(room) {
    return Object.values(this._byId).reduce((names, session) => {
      if (session.room === room) names.push(session.name)
      return names
    }, [])
  }
}

module.exports = { Sessions }
