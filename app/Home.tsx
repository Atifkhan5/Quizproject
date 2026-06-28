import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Dimensions
} from 'react-native';

import { auth, db } from './firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const App = ({ navigation }: { navigation: any }) => {

    const [userName, setUserName] = useState('');
    const [score, setScore] = useState(0);
    const [quizes, setQuizes] = useState(0);
    const [highest, setHighest] = useState(0);
    const [recent, setRecent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const user = auth.currentUser;
                if (!user) {
                    setLoading(false);
                    return;
                }

                const uid = user.uid;
                const profileRef = doc(db, 'users', uid, 'sub', 'login');
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    setUserName(profileSnap.data().name || '');
                }

                
                const statsRef = doc(db, 'users', uid, 'stats', 'main');
                const statsSnap = await getDoc(statsRef);

                if (statsSnap.exists()) {

                    const data = statsSnap.data();

                    setScore(data.score ?? 0);
                    setQuizes(data.quizes ?? 0);
                    setHighest(data.highest ?? 0);
                    setRecent(data.recent ?? '');

                }

            } catch (error: any) {
                console.log("Dashboard error:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#38BDF8" />
                <Text style={styles.loadingText}>Synchronizing data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Welcome back,</Text>
                            <Text style={styles.userNameText}>
                                {userName || 'Explorer'}
                            </Text>
                        </View>

                        <Pressable style={styles.profileCircle}>
                            <Ionicons name="person" size={20} color="#38BDF8" />
                        </Pressable>
                    </View> 
                    <View style={styles.statsSurface}>

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>AVG SCORE</Text>
                            <Text style={styles.statValue}>{score}%</Text>
                        </View>

                        <View style={[styles.statItem, styles.statBorder]}>
                            <Text style={styles.statLabel}>QUIZZES</Text>
                            <Text style={styles.statValue}>{quizes}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>BEST</Text>
                            <Text style={styles.statValue}>{highest}%</Text>
                        </View>

                    </View> 
                    <Text style={styles.sectionHeader}>Generate Quiz</Text>

                    <View style={styles.actionRow}>

                        <Pressable
                            style={styles.actionTile}
                            onPress={() => navigation.navigate('quiz')}
                        >
                            <LinearGradient colors={['#1E293B', '#334155']} style={styles.tileGradient}>
                                <Ionicons name="cloud-upload" size={28} color="#38BDF8" />
                                <Text style={styles.tileTitle}>From File</Text>
                                <Text style={styles.tileDesc}>Upload PDF/Docs</Text>
                            </LinearGradient>
                        </Pressable>

                        <Pressable
                            style={styles.actionTile}
                            onPress={() => navigation.navigate('quiz')}
                        >
                            <LinearGradient colors={['#1E293B', '#334155']} style={styles.tileGradient}>
                                <Ionicons name="flash" size={28} color="#A78BFA" />
                                <Text style={styles.tileTitle}>AI Prompt</Text>
                                <Text style={styles.tileDesc}>Text to Quiz</Text>
                            </LinearGradient>
                        </Pressable>

                    </View> 
                    <Text style={styles.sectionHeader}>Recent Activity</Text>

                    <View style={styles.recentGlassCard}>

                        {recent === '' ? (
                            <Text style={{ color: '#64748B' }}>
                                No recent activity
                            </Text>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                <Text style={{ color: '#CBD5E1', marginLeft: 10 }}>
                                    {recent}
                                </Text>
                            </View>
                        )}

                    </View>

                </ScrollView>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
    },
    loadingText: {
        marginTop: 15,
        color: '#94A3B8',
        fontSize: 14,
        letterSpacing: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 25,
    },
    greeting: {
        fontSize: 16,
        color: '#94A3B8',
    },
    userNameText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#F8FAFC',
        marginTop: 2,
    },
    profileCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    statsSurface: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        borderRadius: 24,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 30,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#334155',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 1,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#38BDF8',
        marginTop: 4,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F8FAFC',
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionTile: {
        width: (width - 55) / 2,
        height: 180,
    },
    tileGradient: {
        flex: 1,
        borderRadius: 28,
        padding: 20,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    tileTitle: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: '700',
    },
    tileDesc: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 4,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAllText: {
        color: '#38BDF8',
        fontSize: 14,
        fontWeight: '600',
    },
    recentGlassCard: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
        minHeight: 100,
        justifyContent: 'center',
    },
    emptyState: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    emptyText: {
        color: '#64748B',
        fontSize: 14,
    },
    activeRecent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recentText: {
        color: '#CBD5E1',
        fontSize: 15,
        marginLeft: 10,
    }
});

export default App;