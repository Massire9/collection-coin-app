import { StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { LineChart } from "react-native-gifted-charts";
import { trpc } from '@/lib/trpc';
import { Coins } from '../../../server/src/lib/prisma';
import _ from 'lodash'

export default function TabTwoScreen() {
  const {
    data: coins,
    isLoading,
    error,
    failureReason,
  } = trpc.coins.get.useQuery();

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if(coins) {
    const values = coins.map((coin: Coins) => ({
      value: coin.value,
      label: coin.year.toString()
    }))
    
    let data: {label: string, value: number }[] = []
    const groupedValues = _.groupBy(values, 'label')
    for(const [year, val] of Object.entries(groupedValues)) {
      const sum: number = val.reduce((acc, curr) => acc + curr.value, 0)
      data.push({label: year, value: sum})
    }
    let acc = 0
    data = data.map(({label, value}) => {
      acc += value
      return {
        label,
        value: acc
      }
    })
    return (
      <View style={styles.container}>
        <Text>Evolution de la valeur totale au fil du temps</Text>
        <LineChart data={data} />
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
