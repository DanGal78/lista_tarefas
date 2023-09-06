import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, FlatList, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TarefaProps {
  tarefa: string;
  finalizado?: boolean;
  isEditando?: boolean;

 }
 const TAREFAS_CHAVES = "MeuAPP@tarefas"
    export default function App() {
      const [tarefa, setTarefa] = useState('');
      const [tarefas, setTarefas] = useState<TarefaProps[]>([]);
      const [tarefaEditada, setTarefaEditada] = useState('');
      const [indexEditando, setIndexEditando] = useState(-1);
      const editandoRef = useRef<TextInput | null>(null);

      useEffect(() => {
        editandoRef.current?.focus();
      }, [indexEditando]);

      useEffect(() => {
        AsyncStorage.getItem(TAREFAS_CHAVES).then((valor) => {
          if (!valor) return;
          setTarefas(JSON.parse(valor));
        });
      },[]);

      useEffect(() => {
        AsyncStorage.setItem(TAREFAS_CHAVES, JSON.stringify(tarefas));
      }, [tarefas]);

      const handleAddTarefa = () =>{
        if (tarefa === '') return;
        setTarefas([...tarefas, {tarefa, finalizado: false}]);
        setTarefa('');
      };

      const handleFinalizarTarefa = (index: number) => {
        const newTarefas = [...tarefas];
        newTarefas[index].finalizado = !newTarefas[index].finalizado;
        setTarefas(newTarefas);
      };

      const handleEditTarefa = (index: number) => { 
        const newTarefas = [...tarefas];
        if (newTarefas[index].isEditando) {
          newTarefas[index].tarefa = tarefaEditada;
          setTarefaEditada('');
          setIndexEditando(-1);
        } 

        if (!newTarefas[index].isEditando) {
          setTarefaEditada(newTarefas[index].tarefa);
          setIndexEditando(index);
          
        }

        newTarefas[index].isEditando = !newTarefas[index].isEditando;
        setTarefas(newTarefas);
      };

      const handleRemoveTarefa = (index: number) => {
        const newTarefas = [...tarefas];
        newTarefas.splice(index, 1);
        setTarefas(newTarefas);
      };

      return ( 
      <SafeAreaView style={styles.container}>
        <View style={styles.tiluloContainer}>
          <Text style={styles.titulo}>Lista de Tarefas</Text>
          <Text style={styles.subTitulo}>Suas tarefas</Text>
        </View>
        <View style={styles.tarefasContainer}>
          <View style={styles.formulario}>
          <TextInput
            style={styles.input}
            onChangeText={setTarefa}
            value={tarefa}
            placeholder="Digite a tarefa"
           />
           <Button title='Adicinar' onPress={handleAddTarefa}/>
          </View>
         <FlatList
            data={tarefas}
            keyExtractor={(_, index: number) => index.toString()}
            renderItem={({item, index}) => (
              <View style={[styles.lista, index % 2 === 0 ? styles.lighbg : styles.darkbg,]}>
                {
                  item.isEditando ? (
                    <TextInput
                    ref={editandoRef}
                    onChangeText={setTarefaEditada}
                    value={tarefaEditada}
                    
                   />
                  ) : ( 
                    <Text style={[styles.listaDescricao,
                    item.finalizado ? styles.atividadeFinalizada : null,
                    ]}
                    >
                     {item.tarefa}
                    </Text>
                   )}
             
              <View style={styles.botoesDeAcao}>
                {indexEditando > -1 && index !== indexEditando  ? null : (
                  <Pressable style={[styles.listaBotao, item.isEditando ? styles.botaoSalvar : styles.botaoEditar]}
                  onPress={() => handleEditTarefa(index)}
                  >
                    <Icon name={item.isEditando ? "save" : "edit"} size={15} color="#FFF"/>
                  </Pressable>
                )}
                
              {!item.finalizado ? (
                <Pressable 
                onPress={() => handleFinalizarTarefa(index)} 
                style={[styles.listaBotao, styles.botaoFinaliza]}
                >
                <Icon name="check" color="#FFF"/>
                </Pressable>
              ) : (
                <Pressable onPress={() => handleFinalizarTarefa(index)} style={[styles.listaBotao, styles.botaoFinaliza]}>
                <Icon name="cross" size={15} color="#FFF"/>
                </Pressable>
                )}

              <Pressable
               onPress={() => handleRemoveTarefa(index)} 
              style={[styles.listaBotao, styles.botaoDelete]}
              >
                <Icon name="trash" size={15} color="#FFF" />
                </Pressable>
                </View>
              </View>
            )}
            />
          </View>
      </SafeAreaView>);
    }

const styles = StyleSheet.create({

  lighbg: {
    backgroundColor: '#f0f0f0',
  },
  darkbg: {
    backgroundColor: '#e0e0e0',
  },
  botaoEditar: {
    backgroundColor: '#ffd700',
  },
  atividadeFinalizada: {
    textDecorationLine: 'line-through',
  },
  botaoRFinalizar: {
    backgroundColor: '#87CEFA',
  },
  botaoSalvar: {
    backgroundColor: '#52FF00',
  },

  listaBotaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    
  },
  listaDescricao: {
    fontSize: 20,
  },
  botoesDeAcao: {
    flexDirection: "row",
    gap: 6,
  },
  botaoFinaliza: {
    backgroundColor: '#6f64ff',
  },
  botaoDelete: {
    backgroundColor: '#ff6464',
  },

  listaBotao: { 
    padding: 8,
    borderRadius: 2,
  },

  tarefasContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    
  },
  formulario: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
    maxHeight: 40,
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  tiluloContainer: {
    padding: 4,
    gap: 2,
    marginBottom: 10,
  },

  input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        width: '78%',       
        padding: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,    
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6f64ff',
  },
  subTitulo: {
    fontSize: 20,
    color: '#a9a8b8'
  },
});
