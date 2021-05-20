import React, { useContext } from 'react';
import AppStoreReplyView from '../appstore/AppStoreReplyView';
import EmailScoreReply from '../email/EmailScoreReply';
import Chat from '../../../common/issueContent/Chat';
import { userJonContext } from '../../../const';

export default ({ source, row, isTranslate = false }) => {
  source = source && source.toString();
  const { qualityCheck } = row;
  const userJson = useContext(userJonContext);
  if (['google', 'appstore', 'huawei'].includes(source)) {
    return <AppStoreReplyView
      source={source}
      row={qualityCheck}
      isTranslate={isTranslate}
    />;
  }
  if (source === '2') {
    return <EmailScoreReply
      row={qualityCheck}
    />;
  }
  if (source === '1') {
    return <Chat
      userMap ={userJson}
      list={qualityCheck.chatLogHistory ? JSON.parse(qualityCheck.chatLogHistory) : []}
    />;
  }
  // if (source === '4') {
  //   // FILE_SERVER+RECORD_FILE_NAME
  //   return <audio key={qualityCheck.recordFileName} controls >
  //     <source src={`${qualityCheck.fileServer}/${qualityCheck.recordFileName}`} />
  //   </audio>;
  // }
  return null;
};
