import React from 'react'
import * as N3 from 'n3'
import NotificationsViewerComponent from '../Components/NotificationsViewerComponent'
import InProgressViewerComponent from '../Components/InProgressViewerComponent'
import CertificatesViewerComponent from '../Components/CertificatesViewerComponent'
import ProfileViewerComponent from '../Components/ProfileViewerComponent'
import ProfileEditorComponent from '../Components/ProfileEditorComponent'
import RequestsViewerComponent from '../Components/RequestsViewerComponent'
import HelpComponent from '../Components/HelpComponent'
import MarriageRequestComponent from '../Components/MarriageRequestComponent'
import MarriageViewComponent from '../Components/MarriageViewComponent'
import OfficialComponent from '../Components/OfficialComponent'
import LoginComponent from '../Components/LoginComponent'
import { getFile } from './FileUtil'

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HelpIcon from '@material-ui/icons/Help';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import ListIcon from '@material-ui/icons/List';
import GavelIcon from '@material-ui/icons/Gavel';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import ns from "../util/NameSpaces"
import SubmissionViewComponent from '../Components/SubmissionViewComponent'
import CertificateViewComponent from '../Components/CertificateViewComponent'
const { default: data } = require('@solid/query-ldflex');



export async function getPromiseValueOrUndefined (promise){
  try { return await promise.value }
  catch { return undefined }
}

export const availableViews = {
  login:          {id:"login",            label:'Login',            generation:(props) => <LoginComponent {...props} ></LoginComponent>, icon: <ExitToAppIcon />},
  profile:        {id:"profile",          label:'Profile',          generation:(props) => <ProfileViewerComponent {...props} ></ProfileViewerComponent>, icon: <PersonIcon />},
  profileeditor:  {id:"profileedit",      label:'Profile Editor',   generation:(props) => <ProfileEditorComponent {...props} ></ProfileEditorComponent>, icon: <HelpIcon />},
  requests:       {id:"requests",         label:'Requests',         generation:(props) => <RequestsViewerComponent {...props}></RequestsViewerComponent>, icon: <InsertDriveFileIcon />},
  marriagerequest: {id:"marriagerequest", label:'Marriage request', generation:(props) => <MarriageRequestComponent {...props}></MarriageRequestComponent>, icon: <HelpIcon />},
  marriageview:   {id:"marriageview",     label:'Marriage view',    generation:(props) => <MarriageViewComponent {...props}></MarriageViewComponent>, icon: <HelpIcon />},
  running:        {id:"running",          label:'In progress',      generation:(props) => <InProgressViewerComponent {...props}></InProgressViewerComponent>, icon: <ListIcon />},
  certificates:   {id:"certificates",     label:'Certificates',     generation:(props) => <CertificatesViewerComponent {...props}></CertificatesViewerComponent>, icon: <CardMembershipIcon />},
  notifications:  {id:"notifications",    label:'Notifications',    generation:(props) => <NotificationsViewerComponent {...props}></NotificationsViewerComponent>, icon: <NotificationsIcon />},
  help:           {id:"help",             label:'Help',             generation:(props) => <HelpComponent {...props}></HelpComponent>, icon: <HelpIcon />},
  official:       {id:"official",         label:'Offical',          generation:(props) => <OfficialComponent {...props}></OfficialComponent>, icon: <GavelIcon />},
  submissionview: {id:"submissionview",   label:'Submission view',  generation:(props) => <SubmissionViewComponent {...props}></SubmissionViewComponent>, icon: <HelpIcon />},
  certificateview:{id:"certificateview",  label:'Certificate view', generation:(props) => <CertificateViewComponent {...props}></CertificateViewComponent>, icon: <HelpIcon />},
}

export const activeDrawerItemMapping = {
  profile:          "profile",
  profileeditor:    "profile",
  requests:         "requests",
  marriagerequest:  "requests",
  running:          "running",
  marriageview:     "running",
  certificates:     "certificates",
  certificateview:  "certificates",
  official:         "official",
  submissionview:   "official",
  notifications:    "notifications",
  help:             "help",
}

export async function getStore(URI){
  const response = await getFile(URI)
  const code = await response
  const responseData = await response.text()
  const store = new N3.Store()
  store.addQuads(await new N3.Parser({ baseIRI: URI}).parse(responseData))
  return store
}

const getQuadObjVal = quads => quads[0] && (quads[0].object.value || quads[0].object.id)

const getQuadObjList = quads => quads && quads.map(quad => quad.object.value || quad.object.id)


export async function getContractData(id) {
  const datastore = await getStore(id);
  return datastore && {
    id: id,
    creator: getQuadObjVal(await datastore.getQuads(id, ns.dct('creator'))),
    certified_by: getQuadObjVal(await datastore.getQuads(id, ns.demo('certified_by'))),
    status: getQuadObjVal(await datastore.getQuads(id, ns.demo('status'))),
    spouse: getQuadObjList(await datastore.getQuads(id, ns.dbo('spouse'))).map(e => {return({id: e})}),
    witness: getQuadObjList(await datastore.getQuads(id, ns.demo('witness'))).map(e => {return({id: e})}),
  }
  // const contract = {id: id, completed: false, spouse: [], witness: []}
  // contract.creator = `${await data[id][ns.dct('creator')]}`
  // contract.certifiedBy = `${await data[id][ns.demo('certified_by')]}`
  // contract.status = `${await data[id][ns.demo('status')]}`
  // for await (const spouseId of data[id][ns.dbo('spouse')]){
  //   contract.spouse.push({id: spouseId.value})
  // }
  // for await (const witnessId of data[id][ns.demo('witness')]){
  //   contract.witness.push({id: witnessId.value})
  // }
  // return contract
}

export async function getCertificateData(id) {
  const datastore = await getStore(id);
  return datastore && {
    id: id,
    certifies: getQuadObjVal(await datastore.getQuads(id, ns.demo('certifies'))),
    certified_by: getQuadObjVal(await datastore.getQuads(id, ns.demo('certified_by'))),
    certification_date: getQuadObjVal(await datastore.getQuads(id, ns.demo('certification_date'))),
    comment: getQuadObjVal(await datastore.getQuads(id, ns.rdfs('comment'))),
  }
}

/**
 * 
 * @param 
 * { <> a <http://semicdemo.example/Certificate> ;
  <http://semicdemo.example/certifies> <https://alice.localhost:8443/public/marriageproposal2020-09-29T10%3A19%3A15.988Z.ttl> ;
  <http://semicdemo.example/certified_by> <https://alice.localhost:8443/profile/card#me> ;
  <http://semicdemo.example/certification_date> "2020-09-29T10:19:25.838Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> ;
  <http://www.w3.org/2000/01/rdf-schema#comment> "This is a certificate for the Marriage proposal https://alice.localhost:8443/public/marriageproposal2020-09-29T10%3A19%3A15.988Z.ttl by https://alice.localhost:8443/profile/card#me" .
} activity 
 */

export async function getNotificationTypes(activity){
  const types = {}
  for (const property of ['actor', 'object', 'target']){
    if(activity[property]){
      if (typeof(activity[property]) === 'string') {
        types[property] = `${await data[activity[property]].type}`
      } else if (typeof(activity[property]) === 'object') {
        types[property] = await getNotificationTypes(activity[property])
      }
    }
  }
  return types
}

export async function getProposalActors(proposalId){
  // return creator, spouse, witness.
}
