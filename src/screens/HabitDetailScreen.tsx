import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, Screen, TextInput } from '../components';
import { useTheme } from '../theme';
import { useHabitsStore } from '../store';
import { cancelHabitReminder, getDateKey, getLastSevenDays, isValidReminderTime, scheduleHabitReminder } from '../utils';

const iconOptions = [
  { name: 'checkbox-outline', label: 'Check' },
  { name: 'fitness-outline', label: 'Fitness' },
  { name: 'book-outline', label: 'Libro' },
  { name: 'moon-outline', label: 'Sueño' },
  { name: 'water-outline', label: 'Agua' },
  { name: 'heart-outline', label: 'Salud' },
  { name: 'walk-outline', label: 'Caminar' },
  { name: 'sparkles-outline', label: 'Estilo' },
];

const colorPalette = ['#2F6FED', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function HabitDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const habitId = route.params?.habitId;
  const existingHabit = useHabitsStore((state) =>
    state.habits.find((habit) => habit.id === habitId),
  );
  const createHabit = useHabitsStore((state) => state.createHabit);
  const updateHabit = useHabitsStore((state) => state.updateHabit);
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  const completionRecords = useHabitsStore((state) => state.completionRecords);
  const { colors, typography } = useTheme();

  const isEditing = Boolean(habitId && existingHabit);

  const [nombre, setNombre] = useState(existingHabit?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(existingHabit?.descripcion ?? '');
  const [icono, setIcono] = useState(existingHabit?.icono ?? iconOptions[0].name);
  const [color, setColor] = useState(existingHabit?.color ?? colorPalette[0]);
  const [metaSemanal, setMetaSemanal] = useState(existingHabit?.metaSemanal ?? 3);
  const [horaRecordatorio, setHoraRecordatorio] = useState(existingHabit?.horaRecordatorio ?? '');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(Number(existingHabit?.horaRecordatorio?.split(':')[0] ?? 9));
  const [selectedMinute, setSelectedMinute] = useState(Number(existingHabit?.horaRecordatorio?.split(':')[1] ?? 0));

  useEffect(() => {
    if (existingHabit) {
      setNombre(existingHabit.nombre);
      setDescripcion(existingHabit.descripcion ?? '');
      setIcono(existingHabit.icono);
      setColor(existingHabit.color);
      setMetaSemanal(existingHabit.metaSemanal);
      setHoraRecordatorio(existingHabit.horaRecordatorio ?? '');
      setSelectedHour(Number(existingHabit.horaRecordatorio?.split(':')[0] ?? 9));
      setSelectedMinute(Number(existingHabit.horaRecordatorio?.split(':')[1] ?? 0));
    }
  }, [existingHabit]);

  const isValid = useMemo(() => {
    const trimmedName = nombre.trim();
    const validReminder = horaRecordatorio.length === 0 || isValidReminderTime(horaRecordatorio);
    return trimmedName.length > 0 && metaSemanal >= 1 && metaSemanal <= 7 && validReminder;
  }, [nombre, metaSemanal, horaRecordatorio]);

  const handleSave = async () => {
    const trimmedName = nombre.trim();

    if (!trimmedName) {
      Alert.alert('Nombre obligatorio', 'Escribe un nombre para el hábito.');
      return;
    }

    if (metaSemanal < 1 || metaSemanal > 7) {
      Alert.alert('Meta semanal no válida', 'La meta semanal debe estar entre 1 y 7 días.');
      return;
    }

    if (horaRecordatorio && !isValidReminderTime(horaRecordatorio)) {
      Alert.alert('Hora no válida', 'Usa el formato HH:mm, por ejemplo 08:30.');
      return;
    }

    const payload = {
      nombre: trimmedName,
      descripcion: descripcion.trim() || undefined,
      icono,
      color,
      metaSemanal,
      horaRecordatorio: horaRecordatorio || undefined,
    };

    let savedHabit;
    if (isEditing && existingHabit) {
      updateHabit(existingHabit.id, payload);
      savedHabit = { ...existingHabit, ...payload };
    } else {
      savedHabit = createHabit(payload);
    }

    try {
      await scheduleHabitReminder(savedHabit);
    } catch {
      Alert.alert('Recordatorio no disponible', 'El hábito se guardó, pero no se pudo programar la notificación.');
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existingHabit) {
      return;
    }

    Alert.alert(
      'Eliminar hábito',
      `¿Seguro que quieres eliminar "${existingHabit.nombre}"? Esta acción también borrará sus registros de cumplimiento.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await cancelHabitReminder(existingHabit.id);
            deleteHabit(existingHabit.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const confirmReminderTime = () => {
    setHoraRecordatorio(`${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`);
    setIsTimePickerVisible(false);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <View style={[styles.previewCard, { backgroundColor: color + '22', borderColor: color }]}>
            <View style={[styles.previewBadge, { backgroundColor: color }]}>
              <Ionicons name={icono as any} size={26} color="#FFFFFF" />
            </View>
            <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>{nombre.trim() || 'Nombre del hábito'}</Text>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.title }]}>
            {isEditing ? 'Editar hábito' : 'Nuevo hábito'}
          </Text>

          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Nombre</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Leer 20 minutos"
            style={styles.input}
          />

          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Descripción</Text>
          <TextInput
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Opcional"
            multiline
            style={[styles.input, styles.textArea]}
          />

          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Hora de recordatorio (opcional)</Text>
          <View style={styles.reminderRow}>
            <Pressable
              onPress={() => setIsTimePickerVisible(true)}
              style={[styles.timeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.timeButtonText, { color: colors.textPrimary }]}>{horaRecordatorio || 'Elegir hora'}</Text>
            </Pressable>
            {horaRecordatorio ? (
              <Pressable onPress={() => setHoraRecordatorio('')}>
                <Text style={[styles.clearReminder, { color: colors.danger }]}>Quitar</Text>
              </Pressable>
            ) : null}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Icono</Text>
          <View style={styles.optionGrid}>
            {iconOptions.map((option) => (
              <TouchableOpacity
                key={option.name}
                onPress={() => setIcono(option.name)}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: icono === option.name ? colors.primary : colors.surface,
                    borderColor: icono === option.name ? colors.primary : colors.border,
                  },
                ]}
              >
                <Ionicons name={option.name as any} size={20} color={icono === option.name ? '#FFFFFF' : colors.textPrimary} />
                <Text style={[styles.optionLabel, { color: icono === option.name ? '#FFFFFF' : colors.textSecondary }]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Color</Text>
          <View style={styles.optionGrid}>
            {colorPalette.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setColor(option)}
                style={[
                  styles.colorButton,
                  { backgroundColor: option, borderColor: color === option ? colors.textPrimary : 'transparent' },
                ]}
              />
            ))}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Meta semanal</Text>
          <View style={styles.metaSelector}>
            {[1, 2, 3, 4, 5, 6, 7].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setMetaSemanal(option)}
                style={[
                  styles.metaButton,
                  {
                    backgroundColor: metaSemanal === option ? colors.primary : colors.surface,
                    borderColor: metaSemanal === option ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: metaSemanal === option ? '#FFFFFF' : colors.textPrimary, fontWeight: '700' }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isEditing && existingHabit && (
            <View style={styles.historySection}>
              <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Historial de los últimos 7 días</Text>
              <View style={styles.historyRow}>
                {getLastSevenDays().map((date) => {
                  const dateKey = getDateKey(date);
                  const completed = completionRecords.some(
                    (record) => record.habitId === existingHabit.id && record.fecha === dateKey,
                  );

                  return (
                    <View key={dateKey} style={styles.historyDay}>
                      <Text style={[styles.historyDate, { color: colors.textSecondary }]}>{date.getDate()}</Text>
                      <View style={[styles.historyIndicator, { backgroundColor: completed ? existingHabit.color : colors.border }]}>
                        <Ionicons name={completed ? 'checkmark' : 'remove'} size={14} color={completed ? '#FFFFFF' : colors.textSecondary} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.actions}>
            {isEditing && (
              <Button
                title="Eliminar"
                variant="secondary"
                onPress={handleDelete}
                style={styles.deleteButton}
              />
            )}

            <Button
              title={isEditing ? 'Guardar cambios' : 'Guardar hábito'}
              onPress={handleSave}
              disabled={!isValid}
              style={[styles.saveButton, !isValid && styles.disabledButton]}
            />
          </View>
        </Card>
      </ScrollView>
      <Modal visible={isTimePickerVisible} transparent animationType="slide" onRequestClose={() => setIsTimePickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.timeModal, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Hora de recordatorio</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Elige una hora para recibirlo cada día.</Text>
            <View style={styles.pickerRow}>
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>Hora</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {Array.from({ length: 24 }, (_, hour) => (
                    <TouchableOpacity key={hour} onPress={() => setSelectedHour(hour)} style={[styles.pickerOption, selectedHour === hour && { backgroundColor: colors.primary }]}>
                      <Text style={{ color: selectedHour === hour ? '#FFFFFF' : colors.textPrimary, fontWeight: '700' }}>{String(hour).padStart(2, '0')}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <Text style={[styles.timeSeparator, { color: colors.textPrimary }]}>:</Text>
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>Minutos</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {Array.from({ length: 60 }, (_, minute) => (
                    <TouchableOpacity key={minute} onPress={() => setSelectedMinute(minute)} style={[styles.pickerOption, selectedMinute === minute && { backgroundColor: colors.primary }]}>
                      <Text style={{ color: selectedMinute === minute ? '#FFFFFF' : colors.textPrimary, fontWeight: '700' }}>{String(minute).padStart(2, '0')}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={styles.modalActions}>
              <Button title="Cancelar" variant="secondary" onPress={() => setIsTimePickerVisible(false)} style={styles.modalAction} />
              <Button title="Confirmar" onPress={confirmReminderTime} style={styles.modalAction} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
  },
  previewBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewTitle: {
    fontWeight: '700',
    fontSize: 18,
    flexShrink: 1,
  },
  title: {
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearReminder: {
    marginLeft: 12,
    fontWeight: '700',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  iconButton: {
    width: 80,
    minHeight: 72,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  optionLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  colorButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
  },
  metaSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  metaButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historySection: {
    marginBottom: 24,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDay: {
    alignItems: 'center',
    gap: 5,
  },
  historyDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  historyIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 12,
  },
  deleteButton: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  timeModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  pickerScroll: {
    height: 160,
    width: '100%',
  },
  pickerOption: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalAction: {
    flex: 1,
  },
});
