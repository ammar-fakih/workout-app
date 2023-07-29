import {
  Box,
  Button,
  FlatList,
  HStack,
  Heading,
  Text,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RepeatEvery, Workout } from './types';
import { dayNames } from './constants';
import { selectWorkouts, userDataReadFromFile } from './workoutsSlice';
import myWorkouts from '../../../myWorkout.json';

export default function Home() {
  const [todaysWorkouts, setTodaysWorkouts] = useState<Workout[] | null>(null);
  const allWorkouts = useAppSelector(selectWorkouts);
  const dispatch = useAppDispatch();

  const today = new Date();
  today.setDate(today.getDate() + 2);

  useEffect(() => {
    // TODO: remove when async storage is working
    dispatch(userDataReadFromFile(parseEnums(myWorkouts)));

    setTodaysWorkouts(allWorkouts[today.getDay()]);
  }, []);

  const parseEnums = (jsonFromFile: any): Workout[][] => {
    return jsonFromFile.map((workout: any) => ({
      ...workout,
      // @ts-ignore
      repeatEvery: RepeatEvery[workout.repeatEvery],
    }));
  };

  const renderTodaysWorkout = ({
    item,
    index,
  }: {
    item: Workout;
    index: number;
  }) => {
    console.log(item);
    return (
      <VStack p={4}>
        <Text>{item.name ? item.name : index}</Text>
      </VStack>
    );
  };
  console.log(todaysWorkouts)

  return (
    <VStack flex={1} pt={16} p={5} space={5}>
      <VStack justifyContent="space-around" space={1}>
        <Text>{dayNames[today.getDay()]}</Text>
        <Heading>Today's Workouts{!todaysWorkouts && ': Rest!'}</Heading>
      </VStack>

      <FlatList
        flexGrow={0}
        contentContainerStyle={{ maxHeight: 10 }}
        horizontal
        data={todaysWorkouts}
        renderItem={renderTodaysWorkout}
      />

      <HStack space={3}>
        <Button shadow={3} flex={1}>
          <Text color="#fff">Log Workout</Text>
        </Button>
        <Button shadow={3} colorScheme="secondary" flex={1}>
          <Text color="#fff">Start Workout</Text>
        </Button>
      </HStack>

      <HStack justifyContent="space-between" alignItems={'center'}>
        <Heading>Upcoming Workouts</Heading>
        <Button variant="outline">
          <Text>Create Workout</Text>
        </Button>
      </HStack>
    </VStack>
  );
}
