import { useAcceptContact } from "@/hooks/nostr/useAcceptContact";
import { useTheme } from "@/hooks/useTheme";
import { useMessagesStore } from "@/store/messages";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorPopup } from "@/components/ErrorPopup";
import { useMemo, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Requests() {
    const theme = useTheme();
    const allContacts = useMessagesStore(s => s.contacts);

    const contacts = useMemo(
        () => allContacts.filter(c => c.status === "RECEIVED"),
        [allContacts]
    );
    const removeContact = useMessagesStore(s => s.removeContact);
    const { acceptContact, loading, error } = useAcceptContact();
    const [errorVisible, setErrorVisible] = useState(false);
    const [processingPk, setProcessingPk] = useState<Object>({});
    
    const [processingStates, setProcessingStates] = useState<Record<string, 'accepting' | 'declining' | null>>({});

    const handleAccept = async (pk: string) => {
        setProcessingStates(prev => ({ ...prev, [pk]: 'accepting' }));
        await acceptContact(pk);
        setProcessingStates(prev => ({ ...prev, [pk]: null }));
        if (error) setErrorVisible(true);
    };

    const handleDecline = async (pk: string) => {
        setProcessingStates(prev => ({ ...prev, [pk]: 'declining' }));
        removeContact(pk);
        setProcessingStates(prev => ({ ...prev, [pk]: null }));
    };

    return (
        <SafeAreaView style={[style.container, { backgroundColor: theme.background }]}>
            <Pressable style={style.backButton} onPress={() => {router.back()}}>
                <Ionicons name="arrow-back-outline" size={30} color={theme.text} />
            </Pressable>
            {contacts.length > 0 ? (
                <FlatList
                    data={contacts}
                    keyExtractor={item => item.pk}
                    renderItem={({ item }) => {
                        const isAccepting = processingStates[item.pk] === 'accepting';
                        const isDeclining = processingStates[item.pk] === 'declining';
                        const unavailable = isAccepting || isDeclining
                        return (
                            <View style={[style.requestCard, { backgroundColor: theme.interface.paleBackround }]}>
                                <View style={style.infoContainer}>
                                    <Ionicons name="person-circle-outline" size={50} color={theme.text} />
                                    <Text 
                                        style={[style.name, { color: theme.text }]} 
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {item.name || "Unknown"}
                                    </Text>
                                </View>

                                <View style={style.actions}>
                                    <Pressable
                                        style={[style.button, style.acceptButton, { backgroundColor: theme.interface.primary, opacity: unavailable ? 0.7 : 1}]}
                                        onPress={() => handleAccept(item.pk)}
                                        disabled={ unavailable }
                                    >   
                                    {isAccepting ? (
                                        <ActivityIndicator size="small" color="white"/>
                                    ) : (
                                        <Text style={style.buttonText}>Accept</Text>
                                    )
                                    }
                                    </Pressable>
                                    <Pressable
                                        style={[style.button, style.declineButton, { borderColor: theme.interface.secondary, opacity: unavailable ? 0.7 : 1}]}
                                        onPress={() => handleDecline(item.pk)}
                                        disabled={ unavailable }
                                    >
                                    {isDeclining ? (
                                        <ActivityIndicator size="small" color="white"/>
                                    ) : (
                                        <Text style={[style.buttonText, {color: theme.interface.secondary}]}> Declin </Text>
                                    ) }
                                    </Pressable>
                                </View>
                            </View>
                        );
                    }}
                    contentContainerStyle={style.listContent}
                />
            ) : (
                <View style={style.emptyContainer}>
                    <Text style={[style.emptyText, { color: theme.interface.secondary }]}>
                        You don't have any add requests yet
                    </Text>
                </View>
            )}

            {error && errorVisible && (
                <ErrorPopup
                    message="Failed to accept contact"
                    details={error.message}
                    onClose={() => setErrorVisible(false)}
                />
            )}
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        marginVertical: 12
    },
    requestCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    infoContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        padding: 4,
        flex: 1
    },
    pk: {
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    acceptButton: {
        // backgroundColor from theme.primary
    },
    declineButton: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    backButton: {
        padding: 5,
        top: 10,
        left: 10
    },
});