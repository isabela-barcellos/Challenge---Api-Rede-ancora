// screens/VehicleSearchScreen.js (Remoção de Título e Novo Header com Logo)

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Alert, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator,
    SafeAreaView 
} from 'react-native';
import VehicleDetailCard from '../components/VehicleDetailCard'; 
import { searchVehicle } from '../Services/ancoraAPI'; 
import { Ionicons } from '@expo/vector-icons'; 

// PALETA DE CORES ATUALIZADA
const COLORS = {
    PRIMARY: '#002741',     // Azul Escuro (Solidez)
    SECONDARY: '#C41F2E',   // Vermelho Principal (Destaque/Ação)
    BACKGROUND: '#F7F8FA',  // Cinza Claro (Fundo Geral)
    HEADER_BG: '#002741',   // 🚨 AGORA O HEADER_BG É O AZUL ESCURO
    SUCCESS: '#4CAF50',     // Verde de Sucesso
    TEXT_LIGHT: '#607d8b',
};

// 🚨 Ajuste para a logo local (assumindo assets/ancora-logo.png)
const LOGO_SOURCE = require('../assets/ancora-logo.png'); 

export default function VehicleSearchScreen({ navigation }) {
    const [placa, setPlaca] = useState(''); 
    const [veiculoData, setVeiculoData] = useState(null);
    const [montadora, setMontadora] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        const cleanPlaca = placa.trim().toUpperCase();
        if (cleanPlaca.length < 7) {
            return Alert.alert("Placa Inválida", "Placa deve ter 7 caracteres.");
        }

        setLoading(true);
        setError(null);
        setVeiculoData(null);

        try {
            const data = await searchVehicle(cleanPlaca); 
            if (data.success) {
                setVeiculoData(data.veiculo);
                setMontadora(data.montadora);
            } else {
                setError(data.message || 'Veículo não encontrado. Verifique a placa.');
            }
        } catch (err) {
            setError('Falha na comunicação com o catálogo. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const navigateToPartSearch = () => {
        if (veiculoData && montadora) {
            navigation.navigate('PartSearch', {
                placa: placa.toUpperCase(),
                veiculoData: veiculoData,
                montadora: montadora,
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
            {/* Header Fixo com Logo e Fundo Azul Escuro */}
            <View style={styles.header}>
                <Image 
                    source={LOGO_SOURCE} // Usando a logo do assets
                    style={styles.logo} 
                    resizeMode="contain"
                />
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
                
                {/* Módulo de Busca */}
                <View style={styles.searchBox}>
                    <Text style={styles.title}>Busca Rápida de Peças</Text>
                    <Text style={styles.subtitle}>Digite a placa e encontre o catálogo específico do veículo.</Text>
                    
                    <View style={styles.inputGroup}>
                        <Ionicons name="car-outline" size={24} color={COLORS.PRIMARY} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Placa do Veículo (ABC1234)"
                            value={placa}
                            onChangeText={setPlaca}
                            autoCapitalize="characters"
                            maxLength={7}
                            placeholderTextColor="#999"
                        />
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.button, loading || placa.length < 7 ? styles.buttonDisabled : styles.buttonPrimary]} 
                        onPress={handleSearch} 
                        disabled={loading || placa.length < 7} 
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Buscar Veículo</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                {/* Resultado do Veículo */}
                {veiculoData && (
                    <View style={styles.resultContainer}>
                        {/* Status e Título */}
                        <View style={styles.statusHeader}>
                            <View style={styles.statusBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                <Text style={styles.statusText}>Veículo Compatível Encontrado</Text>
                            </View>
                            <Text style={styles.vehicleTitle}>{montadora} {veiculoData.Modelo}</Text>
                            <Text style={styles.vehicleSubtitle}>Placa: {placa.toUpperCase()}</Text>
                        </View>
                        
                        {/* Detalhes em Cards */}
                        <VehicleDetailCard vehicleData={{ ...veiculoData, Montadora: montadora }} />
                        
                        {/* Botão Principal de Ação (Próxima Etapa) */}
                        <TouchableOpacity
                            style={[styles.button, styles.continueButton]}
                            onPress={navigateToPartSearch}
                        >
                            <Text style={styles.buttonText}>Ver Catálogo de Peças <Ionicons name="arrow-forward-circle-outline" size={18} color="#fff" /></Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Header (Fundo Azul Escuro e sem título "Passo 1")
    header: {
        backgroundColor: COLORS.HEADER_BG, // Azul Escuro
        height: 80, // Altura ajustada
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
        // Removendo borderBottom, pois o contraste com o background claro já é suficiente
        // borderBottomWidth: 1, 
        // borderBottomColor: '#eee',
    },
    logo: {
        width: '70%', // Ajuste o tamanho da logo conforme necessário
        height: 50, 
    },

    scrollContainer: { 
        flex: 1, 
        backgroundColor: COLORS.BACKGROUND, 
    },
    contentContainer: {
        paddingHorizontal: 20, 
        paddingBottom: 30, 
        minHeight: '100%', 
    },
    
    searchBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20,
        elevation: 8, 
        shadowColor: COLORS.PRIMARY,
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 5, 
        color: COLORS.PRIMARY,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        color: COLORS.TEXT_LIGHT,
        textAlign: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: COLORS.PRIMARY,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: { 
        flex: 1,
        height: 50, 
        fontSize: 18, 
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    button: {
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonPrimary: {
        backgroundColor: COLORS.PRIMARY, 
        shadowColor: COLORS.PRIMARY,
    },
    buttonDisabled: {
        backgroundColor: '#90a4ae',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    continueButton: {
        marginTop: 20,
        backgroundColor: COLORS.SECONDARY, 
        shadowColor: COLORS.SECONDARY,
    },
    resultContainer: {
        marginBottom: 30,
    },
    statusHeader: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#fff', 
        elevation: 3,
        shadowColor: COLORS.SUCCESS,
        shadowOpacity: 0.15,
        shadowRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.SUCCESS, 
        marginBottom: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.SUCCESS,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },
    vehicleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
    },
    vehicleSubtitle: {
        fontSize: 14,
        color: COLORS.TEXT_LIGHT,
        marginTop: 5,
    },
    error: { 
        color: COLORS.SECONDARY, 
        textAlign: 'center', 
        marginVertical: 10, 
        padding: 10,
        backgroundColor: COLORS.HEADER_BG, 
        borderRadius: 8,
        fontWeight: '600',
    },
});