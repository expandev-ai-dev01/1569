/**
 * @schema functional
 * Business logic schema for task management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management table
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUserCreator] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NOT NULL DEFAULT (''),
  [priority] INTEGER NOT NULL,
  [status] INTEGER NOT NULL,
  [dueDate] DATE NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskAssignment Task assignment to users
 * @multitenancy true
 * @softDelete false
 * @alias tskAsg
 */
CREATE TABLE [functional].[taskAssignment] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [dateAssigned] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table taskAttachment Task file attachments
 * @multitenancy true
 * @softDelete true
 * @alias tskAtt
 */
CREATE TABLE [functional].[taskAttachment] (
  [idAttachment] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [fileName] NVARCHAR(255) NOT NULL,
  [fileSize] INTEGER NOT NULL,
  [fileType] VARCHAR(50) NOT NULL,
  [filePath] NVARCHAR(500) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskRecurrence Task recurrence configuration
 * @multitenancy true
 * @softDelete false
 * @alias tskRec
 */
CREATE TABLE [functional].[taskRecurrence] (
  [idRecurrence] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [recurrenceType] INTEGER NOT NULL,
  [interval] INTEGER NOT NULL,
  [weekDays] VARCHAR(20) NULL,
  [monthDay] INTEGER NULL,
  [startDate] DATE NOT NULL,
  [endDate] DATE NULL,
  [occurrenceCount] INTEGER NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkTaskAssignment
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskAssignment]
ADD CONSTRAINT [pkTaskAssignment] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [idUser]);
GO

/**
 * @primaryKey pkTaskAttachment
 * @keyType Object
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [pkTaskAttachment] PRIMARY KEY CLUSTERED ([idAttachment]);
GO

/**
 * @primaryKey pkTaskRecurrence
 * @keyType Object
 */
ALTER TABLE [functional].[taskRecurrence]
ADD CONSTRAINT [pkTaskRecurrence] PRIMARY KEY CLUSTERED ([idRecurrence]);
GO

/**
 * @check chkTask_Priority Priority validation
 * @enum {0} Low priority
 * @enum {1} Medium priority
 * @enum {2} High priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status Status validation
 * @enum {0} Pending
 * @enum {1} In progress
 * @enum {2} Completed
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 2);
GO

/**
 * @check chkTaskRecurrence_Type Recurrence type validation
 * @enum {0} Daily
 * @enum {1} Weekly
 * @enum {2} Monthly
 * @enum {3} Yearly
 */
ALTER TABLE [functional].[taskRecurrence]
ADD CONSTRAINT [chkTaskRecurrence_Type] CHECK ([recurrenceType] BETWEEN 0 AND 3);
GO

/**
 * @check chkTaskRecurrence_Interval Interval validation
 */
ALTER TABLE [functional].[taskRecurrence]
ADD CONSTRAINT [chkTaskRecurrence_Interval] CHECK ([interval] >= 1);
GO

/**
 * @check chkTaskRecurrence_MonthDay Month day validation
 */
ALTER TABLE [functional].[taskRecurrence]
ADD CONSTRAINT [chkTaskRecurrence_MonthDay] CHECK ([monthDay] BETWEEN -1 AND 31);
GO

/**
 * @check chkTaskRecurrence_OccurrenceCount Occurrence count validation
 */
ALTER TABLE [functional].[taskRecurrence]
ADD CONSTRAINT [chkTaskRecurrence_OccurrenceCount] CHECK ([occurrenceCount] BETWEEN 1 AND 100);
GO

/**
 * @index ixTask_Account Account filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Status Status filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Status]
ON [functional].[task]([idAccount], [status])
INCLUDE ([title], [priority], [dueDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Priority Priority filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Priority]
ON [functional].[task]([idAccount], [priority])
INCLUDE ([title], [status], [dueDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate Due date filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [status])
WHERE [deleted] = 0 AND [dueDate] IS NOT NULL;
GO

/**
 * @index ixTaskAssignment_Account_Task Task assignment lookup
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAssignment_Account_Task]
ON [functional].[taskAssignment]([idAccount], [idTask]);
GO

/**
 * @index ixTaskAssignment_Account_User User assignment lookup
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAssignment_Account_User]
ON [functional].[taskAssignment]([idAccount], [idUser]);
GO

/**
 * @index ixTaskAttachment_Account_Task Task attachment lookup
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAttachment_Account_Task]
ON [functional].[taskAttachment]([idAccount], [idTask])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskRecurrence_Account_Task Task recurrence lookup
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskRecurrence_Account_Task]
ON [functional].[taskRecurrence]([idAccount], [idTask]);
GO

/**
 * @index uqTask_Account_Title Unique title per account
 * @type Search
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqTask_Account_Title]
ON [functional].[task]([idAccount], [title])
WHERE [deleted] = 0;
GO