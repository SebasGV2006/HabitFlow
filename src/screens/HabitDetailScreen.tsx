import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, Screen, TextInput } from '../components';
import { useTheme } from '../theme';
import { useHabitsStore } from '../store';

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
  const { colors, typography } = useTheme();

  const isEditing = Boolean(habitId && existingHabit);

  const [nombre, setNombre] = useState(existingHabit?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(existingHabit?.descripcion ?? '');
  const [icono, setIcono] = useState(existingHabit?.icono ?? iconOptions[0].name);
  const [color, setColor] = useState(existingHabit?.color ?? colorPalette[0]);
  const [metaSemanal, setMetaSemanal] = useState(existingHabit?.metaSemanal ?? 3);

  useEffect(() => {
    if (existingHabit) {
      setNombre(existingHabit.nombre);
      setDescripcion(existingHabit.descripcion ?? '');
      setIcono(existingHabit.icono);
      setColor(existingHabit.color);
      setMetaSemanal(existingHabit.metaSemanal);
    }
  }, [existingHabit]);

  const isValid = useMemo(() => {
    const trimmedName = nombre.trim();
    return trimmedName.length > 0 && metaSemanal >= 1 && metaSemanal <= 7;
  }, [nombre, metaSemanal]);

  const handleSave = () => {
    const trimmedName = nombre.trim();

    if (!trimmedName) {
      Alert.alert('Nombre obligatorio', 'Escribe un nombre para el hábito.');
      return;
    }

    if (metaSemanal < 1 || metaSemanal > 7) {
      Alert.alert('Meta semanal no válida', 'La meta semanal debe estar entre 1 y 7 días.');
      return;
    }

    const payload = {
      nombre: trimmedName,
      descripcion: descripcion.trim() || undefined,
      icono,
      color,
      metaSemanal,
    };

    if (isEditing && existingHabit) {
      updateHabit(existingHabit.id, payload);
    } else {
      createHabit(payload);
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
          onPress: () => {
            deleteHabit(existingHabit.id);
            navigation.goBack();
          },
        },
      ],
    );
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
});
