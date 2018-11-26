import React, { Component, Fragment } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableHighlight, Image,
} from 'react-native';

// Constants

// Components
import { Icon } from '../../icon';
import { IconButton } from '../../iconButton';
import { Modal } from '../..';

// Styles
// eslint-disable-next-line
import styles from './searchModalStyles';

class SearchModalView extends Component {
  /* Props
    * ------------------------------------------------
    *   @prop { type }    name                - Description....
    */

  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycles

  // Component Functions

  render() {
    const {
      isOpen,
      handleOnClose,
      searchResults,
      handleOnPressListItem,
      handleOnChangeSearchInput,
    } = this.props;

    return (
      <Fragment>
        <Modal isOpen={isOpen} isFullScreen swipeToClose backButtonClose isTransparent>
          <View style={styles.container}>
            <View style={styles.inputWrapper}>
              <Icon style={styles.icon} iconType="FontAwesome" name="search" size={20} />
              <TextInput
                style={styles.input}
                onChangeText={text => handleOnChangeSearchInput(text)}
                placeholder="Search..."
                placeholderTextColor="#c1c5c7"
              />
              <IconButton
                iconStyle={styles.closeIcon}
                iconType="FontAwesome"
                style={styles.closeIconButton}
                name="close"
                onPress={() => handleOnClose()}
              />
            </View>
            <View style={styles.body}>
              <FlatList
                data={searchResults.data}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    onPress={() => handleOnPressListItem(searchResults.type, item)}
                  >
                    <View style={styles.searhItems}>
                      <Image
                        source={{
                          uri:
                            searchResults.type === 'user'
                              ? `https://steemitimages.com/u/${item.author}/avatar/small`
                              : item.img_url
                                || `https://steemitimages.com/u/${item.author}/avatar/small`,
                        }}
                        style={styles.searchItemImage}
                      />
                      <Text style={styles.searchItemText}>
                        {searchResults.type === 'user' ? item.author : item.title}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
                keyExtractor={(post, index) => index.toString()}
                removeClippedSubviews
                onEndThreshold={0}
                initialNumToRender={20}
              />
            </View>
          </View>
        </Modal>
      </Fragment>
    );
  }
}

export default SearchModalView;
