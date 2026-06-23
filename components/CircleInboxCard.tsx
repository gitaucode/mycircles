import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Sortable, SortableItem, SortableRenderItemProps } from 'react-native-reanimated-dnd';
import CircleInboxRow from './CircleInboxRow';
import { Ionicons } from '@expo/vector-icons';

type CircleIconName = keyof typeof Ionicons.glyphMap;

type CircleData = {
  id: string;
  name: string;
  members: string;
  preview: string;
  time: string;
  unread: number;
  iconName: CircleIconName;
  colorHex: string;
  bgHex: string;
  avatars: number[];
};

const INITIAL_DATA: CircleData[] = [
  {
    id: 'c1',
    name: 'Besties',
    members: '6 members',
    preview: "Amani: Let's brunch this weekend?",
    time: '2m ago',
    unread: 3,
    iconName: 'heart',
    colorHex: '#7655F0',
    bgHex: '#F0E9FF',
    avatars: [1, 2, 3, 4],
  },
  {
    id: 'c2',
    name: 'Campus Crew',
    members: '12 members',
    preview: "Brian: Notes for tomorrow's class",
    time: '15m ago',
    unread: 5,
    iconName: 'school',
    colorHex: '#F04D4F',
    bgHex: '#FFE9EA',
    avatars: [2, 0, 5, 6],
  },
  {
    id: 'c3',
    name: 'Family',
    members: '7 members',
    preview: 'Mom: Don\'t forget Sunday lunch \u2764\uFE0F',
    time: '1h ago',
    unread: 2,
    iconName: 'home',
    colorHex: '#20B889',
    bgHex: '#DDF9EC',
    avatars: [7, 1, 4, 0],
  },
  {
    id: 'c4',
    name: 'Creators',
    members: '8 members',
    preview: 'Tasha: New reel is out! Check it \uD83D\uDD25',
    time: '3h ago',
    unread: 1,
    iconName: 'sparkles',
    colorHex: '#2F9AF2',
    bgHex: '#E6F3FF',
    avatars: [5, 6, 2, 3],
  },
];

export default function CircleInboxCard() {
  const [data, setData] = useState(INITIAL_DATA);

  const renderItem = useCallback((props: SortableRenderItemProps<CircleData>) => {
    const { item, id, ...rest } = props;
    return (
      <SortableItem key={id} id={id} data={item} {...rest}>
        <View style={styles.itemWrapper}>
          <CircleInboxRow {...item} />
        </View>
      </SortableItem>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Sortable
        data={data}
        renderItem={renderItem}
        itemHeight={84} // 74 (minHeight) + 10 (gap replacement)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    minHeight: 336, // 4 items * 84
    marginBottom: 10,
  },
  itemWrapper: {
    paddingBottom: 10,
  },
});
