import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Poll } from '../data/mockData';
import { USERS } from '../data/mockData';

type Props = {
  poll: Poll;
  senderId: string;
  timestamp: string;
};

export default function PollCard({ poll, senderId, timestamp }: Props) {
  const sender = USERS.find((u) => u.id === senderId);
  const [options, setOptions] = useState(poll.options);
  const [voted, setVoted] = useState<string | null>(null);
  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = (optId: string) => {
    if (voted) return;
    setVoted(optId);
    setOptions((prev) =>
      prev.map((o) => (o.id === optId ? { ...o, votes: o.votes + 1 } : o))
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.senderName}>{sender?.name}</Text>
        <Text style={styles.label}>📊 Poll</Text>
        <Text style={styles.question}>{poll.question}</Text>
        <Text style={styles.selectHint}>Select one</Text>

        {options.map((opt) => {
          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isVoted = voted === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => handleVote(opt.id)}
              style={({ pressed }) => [
                styles.option,
                isVoted && styles.optionVoted,
                pressed && { opacity: 0.85 },
              ]}
            >
              {/* Progress fill */}
              <View
                style={[
                  styles.optionFill,
                  { width: `${voted ? pct : 0}%` },
                  isVoted && styles.optionFillVoted,
                ]}
              />
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, isVoted && styles.optionTextVoted]}>
                  {opt.label}
                </Text>
                {voted && (
                  <Text style={[styles.pctText, isVoted && styles.pctTextVoted]}>{pct}%</Text>
                )}
              </View>
            </Pressable>
          );
        })}

        <Text style={styles.meta}>{totalVotes} votes · {timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    gap: 6,
  },
  senderName: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.violet,
  },
  label: {
    fontSize: Typography.xs,
    color: Colors.muted,
    fontWeight: Typography.medium,
  },
  question: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.navy,
    marginTop: 2,
  },
  selectHint: {
    fontSize: Typography.xs,
    color: Colors.mutedLight,
    marginBottom: 4,
  },
  option: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.background,
  },
  optionVoted: {
    borderColor: Colors.violet,
  },
  optionFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.violet + '18',
    borderRadius: 12,
  },
  optionFillVoted: {
    backgroundColor: Colors.violet + '28',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: Typography.sm,
    color: Colors.navyMid,
    fontWeight: Typography.medium,
  },
  optionTextVoted: {
    color: Colors.violet,
    fontWeight: Typography.semibold,
  },
  pctText: {
    fontSize: Typography.sm,
    color: Colors.muted,
    fontWeight: Typography.medium,
  },
  pctTextVoted: {
    color: Colors.violet,
    fontWeight: Typography.semibold,
  },
  meta: {
    fontSize: Typography.xs,
    color: Colors.mutedLight,
    marginTop: 4,
  },
});
