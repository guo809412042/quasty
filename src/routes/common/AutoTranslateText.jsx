import React, { Component } from 'react';
import { Button, message } from 'antd';
import { UndoOutlined } from '@ant-design/icons';
import { translate, warningConfigQuery } from '../../service';
import { handleCopyText, cpoyRichText } from '../../utils/utils';
import styles from '../style.less';

class AutoTranslateText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translatedText: '',
      loading: false,
      showText: false,
      // eslint-disable-next-line react/no-unused-state
      keyWord: [],
    };
  }

  componentDidMount() {
    this.query();
    this.handleTranslate();
  }

  // 请求接口你拿到 客户敏感词 & 客服敏感词
  query = async () => {
    // // 请求接口拿到 敏感词数据
    const res = await warningConfigQuery();
    // 结构数据
    const { customerSensitiveWords, serviceSensitiveWords } = res.data;
    // 将字符串 解析为数组
    const customerSensitiveWordsArr = customerSensitiveWords.split('|');
    const serviceSensitiveWordsArr = serviceSensitiveWords.split('|');
    // // 数组去重后等到  存放敏感词的数组
    const keyWord = Array.from(new Set([...customerSensitiveWordsArr, ...serviceSensitiveWordsArr]));
    // // 存储数据
    this.setState({
      keyWord,
    });
    // // 测试用
    // this.setState({
    //   keyWord: [...this.state.keyWord, '测试'],
    // });
    // console.log(this.state.keyWord);
  };

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
    const {
      translatedText, loading, showText, keyWord,
    } = this.state;
    // 拿到 敏感词 给敏感词设置样式
    const getKeyWord = (value, keyword) => {
      keyword.forEach((item) => {
        const r = new RegExp(item, 'g');
        value = value.replace(r, `<span class=${styles.keyword}>${item}</span>`);
      });
      return value;
    };

    return (
      <>
        <div>
          {translatedText && (
            <span>
              <b
                dangerouslySetInnerHTML={{
                  // 调用方法 拿到要展示的html 标签
                  __html: getKeyWord(translatedText, keyWord),
                }}
              />
            </span>
          )}
          {translatedText && (
            <Button
              size="small"
              loading={loading}
              shape="circle"
              onClick={() => this.setState({ showText: true })}
              icon={<UndoOutlined />}
            />
          )}
        </div>
        {showText && (
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            />
            {/* <Button size="small" loading={loading} shape="circle" onClick={this.copyToClip} icon={<CopyOutlined />} /> */}
          </>
        )}
      </>
    );
  }
}

export default AutoTranslateText;
