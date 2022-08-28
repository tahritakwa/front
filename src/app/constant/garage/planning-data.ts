import { SchedulerEvent } from '@progress/kendo-angular-scheduler';

// tslint:disable-next-line:class-name
export class baseDataModel {
    TaskID: number;
    Title: string;
    Description: string;
    Start: Date;
    End: Date;
    EndTimezone?: any;
    RecurrenceRule?: any;
    RecurrenceId?: any;
    RecurrenceException?: any;
    IsAllDay: boolean;
}
 const baseData: baseDataModel[] = [
    {
        TaskID: 1,
        Title: 'Diagnostic',
        Description: 'Diagnostic',
        Start: new Date('2021-03-31T09:00:00.000Z'),
        End: new Date('2021-03-31T11:00:00.000Z'),
        EndTimezone: null,
        RecurrenceRule: null,
        RecurrenceId: null,
        RecurrenceException: null,
        IsAllDay: false,
    },
    {
        TaskID: 2,
        Title: 'Revision',
        Description: 'Revision',
        Start: new Date('2021-04-1T10:00:00.000Z'),
        End: new Date('2021-04-1T11:00:00.000Z'),
        EndTimezone: null,
        RecurrenceRule: null,
        RecurrenceId: null,
        RecurrenceException: null,
        IsAllDay: false,
    },
    {
        TaskID: 3,
        Title: 'Vidange',
        Description: 'Vidange',
        Start: new Date('2021-04-1T10:00:00.000Z'),
        End: new Date('2021-04-1T16:00:00.000Z'),
        EndTimezone: null,
        RecurrenceRule: null,
        RecurrenceId: null,
        RecurrenceException: null,
        IsAllDay: false,
    },
    {
        TaskID: 4,
        Title: 'Nettoyage',
        Description: 'Nettoyage',
        Start: new Date('2021-04-02T09:00:00.000Z'),
        End: new Date('2021-04-02T11:00:00.000Z'),
        EndTimezone: null,
        RecurrenceRule: null,
        RecurrenceId: null,
        RecurrenceException: null,
        IsAllDay: true,
    },
    {
        TaskID: 5,
        Title: 'changement pneu',
        Description: 'changement pneu',
        Start: new Date('2021-04-02T11:00:00.000Z'),
        End: new Date('2021-04-02T16:00:00.000Z'),
        EndTimezone: null,
        RecurrenceRule: null,
        RecurrenceId: null,
        RecurrenceException: null,
        IsAllDay: false,
    },
    {
        TaskID: 6,
        Title: 'changement filtre',
        Description: 'changement filtre',
        Start: new Date('2021-04-01T09:00:00.000Z'),
        End: new Date('2021-04-01T12:00:00.000Z'),
        EndTimezone: null,
        RecurrenceRule: null,
        RecurrenceId: null,
        RecurrenceException: null,
        IsAllDay: false,
    }
];

export const eventsData: SchedulerEvent[] = baseData.map(dataItem => (
    <SchedulerEvent>{
        id: dataItem.TaskID,
        start: new Date(dataItem.Start),
        title: dataItem.Title,
        description: dataItem.Description,
        end: new Date(dataItem.End),
        endTimezone: dataItem.EndTimezone,
        RecurrenceRule: dataItem.RecurrenceRule,
        RecurrenceID: dataItem.RecurrenceId,
        RecurrenceException: dataItem.RecurrenceException,
        isAllDay: dataItem.IsAllDay
    }
));
export const sampleDataWithCustomSchema = baseData.map(dataItem => (
    {
        ...dataItem,
        Start: new Date(dataItem.Start),
        End: new Date(dataItem.End)
    }
));
export class ResourceDataModel {
    Name: string;
    Data: { Id, Text, Value, Color }[];
    Multiple?: boolean;
    Field: string;
    ValueField: string;
    TextField: string;
    ColorField: string;
}


export const resourceData: ResourceDataModel[] = [
    {
        Name: 'Customer 1',
        Data: [
            { Id: 1, Text: 'Panne moteur', Value: 1, Color: '#6eb3fa' },
            { Id: 2, Text: 'Batterie', Value: 2, Color: '#f58a8a' }
        ],
        Field: 'Id',
        ValueField: 'Value',
        TextField: 'Text',
        ColorField: 'Color'
    },
    {
        Name: 'Customer 2',
        Data: [
            { Id: 1, Text: 'Diagnostic', Value: 1, Color: '#f8a398' },
            { Id: 2, Text: 'Nettoyage', Value: 2, Color: '#51a0ed' },
            { Id: 3, Text: 'Vidange', Value: 3, Color: '#56ca85' }
        ],
        Multiple: true,
        Field: 'Id',
        ValueField: 'Value',
        TextField: 'Text',
        ColorField: 'Color'
    }
];

export const groupData = {
    resources: ['Garage'],
    orientation: 'vertical'
};
