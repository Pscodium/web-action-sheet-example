import {
    ActionSheetProvider,
    connectActionSheet,
    ActionSheetProps,
} from '@expo/react-native-action-sheet';
import { Entypo } from '@expo/vector-icons';
import * as React from 'react';
import { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Share,
    Platform,
} from 'react-native';

import ShowActionSheetButton from './ShowActionSheetButton';

type Props = ActionSheetProps & {
  useCustomActionSheet: boolean;
  setUseCustomActionSheet: (next: boolean) => void;
};

interface State {
  selectedIndex?: number | null;
  isModalOpen: boolean;
}

class App extends React.Component<Props, State> {
    state: State = {
        selectedIndex: null,
        isModalOpen: false,
    };

    _updateSelectionText = (selectedIndex?: number) => {
        this.setState({
            selectedIndex,
        });
    };


    _renderSectionHeader = (text: string) => {
        return <Text style={styles.sectionHeaderText}>{text}</Text>;
    };

    _toggleModal = () => {
        this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
    };

    async _onShare() {
        try {
            const result = await Share.share({
                message: 'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.error(error);
        }
    }

    _renderButtons() {
        const { showActionSheetWithOptions } = this.props;
        return (
            <View
                style={{
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        display: Platform.OS === 'ios' ? 'flex' : 'none',
                    }}>
                    {this._renderSectionHeader('Use Custom Action Sheet')}
                    <Text style={{ marginBottom: 10 }}>
            On iOS the default action sheet will be the native UI. However, you can optionally
            enable the custom JS action sheet by setting the useCustomActionSheet prop on the
            provider.
                    </Text>
                    <Entypo.Button
                        backgroundColor={this.props.useCustomActionSheet ? '#3e3e3e' : 'white'}
                        name={this.props.useCustomActionSheet ? 'check' : 'circle'}
                        color={this.props.useCustomActionSheet ? '#fff' : '#3e3e3e'}
                        style={{
                            borderColor: '#3e3e3e',
                            borderWidth: 2,
                        }}
                        onPress={() => this.props.setUseCustomActionSheet(!this.props.useCustomActionSheet)}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: this.props.useCustomActionSheet ? '#fff' : '#3e3e3e',
                            }}>
              Use Custom Action Sheet
                        </Text>
                    </Entypo.Button>
                </View>
                {this._renderSectionHeader('Opções para web, android e iOS')}
                <ShowActionSheetButton
                    title="Options Only"
                    onSelection={this._updateSelectionText}
                    showActionSheetWithOptions={showActionSheetWithOptions}
                />
                <ShowActionSheetButton
                    title="Title"
                    withTitle
                    onSelection={this._updateSelectionText}
                    showActionSheetWithOptions={showActionSheetWithOptions}
                />
                <ShowActionSheetButton
                    title="Title & Message"
                    withTitle
                    withMessage
                    onSelection={this._updateSelectionText}
                    showActionSheetWithOptions={showActionSheetWithOptions}
                />
                <ShowActionSheetButton
                    title="Cancel Button Tint Color"
                    withCancelButtonTintColor
                    onSelection={this._updateSelectionText}
                    showActionSheetWithOptions={showActionSheetWithOptions}
                />
                <ShowActionSheetButton
                    title="iPad Anchor"
                    withAnchor
                    withTitle
                    onSelection={this._updateSelectionText}
                    showActionSheetWithOptions={showActionSheetWithOptions}
                />
                <ShowActionSheetButton
                    title="Nested Action Sheets"
                    onSelection={(index) => {
                        if (!index || index < 3) {
                            showActionSheetWithOptions(
                                {
                                    title: 'Sub Action Sheet',
                                    options: ['One', 'Two', 'Three', 'Done'],
                                    cancelButtonIndex: 3,
                                },
                                this._updateSelectionText
                            );
                        }
                    }}
                    showActionSheetWithOptions={showActionSheetWithOptions}
                />
                <ShowActionSheetButton
                    title="Share Menu"
                    showActionSheetWithOptions={() =>
                        showActionSheetWithOptions(
                            {
                                title: 'Share Menu',
                                options: ['Share', 'Cancel'],
                                cancelButtonIndex: 1,
                            },
                            (i) => {
                                i === 0 && this._onShare();
                            }
                        )
                    }
                />
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.flex}>
                <ScrollView style={styles.flex} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.headerText}>
                        {
                            'Olá!\n\nEste é um exemplo da bibliotéca @expo/react-native-action-sheet.'
                        }
                    </Text>
                    {this._renderButtons()}
                    <Text style={styles.notes}>
                      Nota: Utilizar textos personalizados e ícones só funciona no android. Separadores só podem ser alternados no android; eles sempre aparecem no iOS.
                    </Text>
                    <Text style={styles.notes}>
                      Vale acrescentar que este é um exemplo utilizando componentes em classe o que é de fato, ultrapassado, então o correto é refatorar esse código criando componentes funcionais.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const ConnectedApp = connectActionSheet<any>(App);

export default function WrappedApp() {
    const [useCustomActionSheet, setUseCustomActionSheet] = useState(false);

    return (
        <ActionSheetProvider useCustomActionSheet={useCustomActionSheet}>
            <ConnectedApp
                useCustomActionSheet={useCustomActionSheet}
                setUseCustomActionSheet={setUseCustomActionSheet}
            />
        </ActionSheetProvider>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingVertical: 20,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
    },
    notes: {
        marginTop: 32,
        textAlign: 'center'
    },
    sectionHeaderText: {
        color: 'orange',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    selectionText: {
        textAlign: 'center',
        color: 'blue',
        fontSize: 16,
        marginTop: 20,
    },
    link: {
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});
