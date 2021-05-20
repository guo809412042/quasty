import React, { Component } from 'react';
import { Button, message } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { translate } from '../../service';
import { handleCopyText, cpoyRichText } from '../../utils/utils';

class TranslateText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translatedText: '',
      loading: false,
    };
  }

  handleTranslate = async () => {
    this.setState({
      loading: true,
    });
    try {
      const { text } = this.props;
      const { data } = await translate({
        text,
        target: 'zh',
      });
      this.setState({
        translatedText: data,
      });
    } catch (error) {
      message.error('翻译失败');
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  copyToClip = () => {
    const { text, richText } = this.props;
    if (richText) {
      cpoyRichText(text);
    } else {
      handleCopyText(text);
    }
  };

  render() {
    const { text } = this.props;
    const { translatedText, loading } = this.state;
    return (
      <>
        <span
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
        {!translatedText && (
          <Button
            size="small"
            loading={loading}
            shape="circle"
            onClick={this.handleTranslate}
            icon={<GlobalOutlined />}
          />
        )}
        {/* {<Button size="small" loading={loading} shape="circle" onClick={this.copyToClip} icon={<CopyOutlined />} />} */}
        {translatedText && (
          <>
            <div>
              <b
                dangerouslySetInnerHTML={{
                  __html: translatedText,
                }}
              />
            </div>
          </>
        )}
      </>
    );
  }
}

export default TranslateText;
