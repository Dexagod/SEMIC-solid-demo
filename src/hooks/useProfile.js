import { useState, useEffect } from 'react';
import { getPromiseValueOrUndefined } from '../util/Util'

import createnamespaces from "../util/NameSpaces"
const ns = createnamespaces()

const { default: data } = require('@solid/query-ldflex');

const useProfile = function(webId) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let mounted = true
    getProfile(webId).then(profile => {
      if(mounted) {
        setProfile(profile)
      }
    }).catch(
      setProfile(null)
    )
    return () => {
      mounted = false
    }
  }, [webId])  
  return profile
}

export async function getProfile(webId) {
  webId = await webId;
  if(!webId) return null
  data.clearCache()
  let profiledata = data[webId];
  
  const name = await getPromiseValueOrUndefined(profiledata[ns.foaf('name')]);
  const bdate = await getPromiseValueOrUndefined(profiledata[ns.dbo('birthDate')]);
  const location = await getPromiseValueOrUndefined(profiledata[ns.dbo('location')]);
  const cstatus = await getPromiseValueOrUndefined(profiledata[ns.demo('civilstatus')]);
  
  return { name, bdate, location, cstatus }
}

export default useProfile