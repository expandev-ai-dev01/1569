/**
 * @summary
 * Creates a new task with title, description, priority, due date, and optional assignments.
 * Supports quick creation (minimal fields) and full creation (all fields including attachments and recurrence).
 * 
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - POST /api/v1/internal/task
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User creating the task
 * 
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters)
 * 
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Task description (max 1000 characters)
 * 
 * @param {INT} priority
 *   - Required: Yes
 *   - Description: Priority level (0=Low, 1=Medium, 2=High)
 * 
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date
 * 
 * @param {NVARCHAR(MAX)} assignedUsers
 *   - Required: No
 *   - Description: JSON array of user IDs to assign (max 5)
 * 
 * @param {INT} recurrenceType
 *   - Required: No
 *   - Description: Recurrence type (0=Daily, 1=Weekly, 2=Monthly, 3=Yearly)
 * 
 * @param {INT} recurrenceInterval
 *   - Required: No
 *   - Description: Recurrence interval (min 1)
 * 
 * @param {VARCHAR(20)} recurrenceWeekDays
 *   - Required: No
 *   - Description: Comma-separated week days (0-6) for weekly recurrence
 * 
 * @param {INT} recurrenceMonthDay
 *   - Required: No
 *   - Description: Day of month for monthly recurrence (1-31 or -1 for last day)
 * 
 * @param {DATE} recurrenceStartDate
 *   - Required: No
 *   - Description: Recurrence start date
 * 
 * @param {DATE} recurrenceEndDate
 *   - Required: No
 *   - Description: Recurrence end date
 * 
 * @param {INT} recurrenceOccurrenceCount
 *   - Required: No
 *   - Description: Number of occurrences (1-100)
 * 
 * @returns {INT} idTask - Created task identifier
 * 
 * @testScenarios
 * - Valid quick creation with only title and priority
 * - Valid full creation with all fields
 * - Validation failure for title length
 * - Validation failure for invalid priority
 * - Validation failure for past due date
 * - Validation failure for too many assigned users
 * - Validation failure for invalid recurrence configuration
 * - Transaction rollback on assignment failure
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = '',
  @priority INTEGER = 1,
  @dueDate DATE = NULL,
  @assignedUsers NVARCHAR(MAX) = NULL,
  @recurrenceType INTEGER = NULL,
  @recurrenceInterval INTEGER = NULL,
  @recurrenceWeekDays VARCHAR(20) = NULL,
  @recurrenceMonthDay INTEGER = NULL,
  @recurrenceStartDate DATE = NULL,
  @recurrenceEndDate DATE = NULL,
  @recurrenceOccurrenceCount INTEGER = NULL
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @idTask INTEGER;
  DECLARE @assignedUserCount INTEGER;

  BEGIN TRY
    /**
     * @validation Title required
     * @throw {titleRequired}
     */
    IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
    BEGIN
      ;THROW 51000, 'titleRequired', 1;
    END;

    /**
     * @validation Title minimum length
     * @throw {titleTooShort}
     */
    IF (LEN(LTRIM(RTRIM(@title))) < 3)
    BEGIN
      ;THROW 51000, 'titleTooShort', 1;
    END;

    /**
     * @validation Title maximum length
     * @throw {titleTooLong}
     */
    IF (LEN(@title) > 100)
    BEGIN
      ;THROW 51000, 'titleTooLong', 1;
    END;

    /**
     * @validation Description maximum length
     * @throw {descriptionTooLong}
     */
    IF (LEN(@description) > 1000)
    BEGIN
      ;THROW 51000, 'descriptionTooLong', 1;
    END;

    /**
     * @validation Priority valid range
     * @throw {invalidPriority}
     */
    IF (@priority NOT BETWEEN 0 AND 2)
    BEGIN
      ;THROW 51000, 'invalidPriority', 1;
    END;

    /**
     * @validation Due date format
     * @throw {invalidDueDate}
     */
    IF (@dueDate IS NOT NULL AND @dueDate < CAST(GETUTCDATE() AS DATE))
    BEGIN
      ;THROW 51000, 'dueDateInPast', 1;
    END;

    /**
     * @validation Assigned users count
     * @throw {tooManyAssignedUsers}
     */
    IF (@assignedUsers IS NOT NULL)
    BEGIN
      SELECT @assignedUserCount = COUNT(*)
      FROM OPENJSON(@assignedUsers);

      IF (@assignedUserCount > 5)
      BEGIN
        ;THROW 51000, 'tooManyAssignedUsers', 1;
      END;
    END;

    /**
     * @validation Recurrence configuration
     * @throw {invalidRecurrenceConfiguration}
     */
    IF (@recurrenceType IS NOT NULL)
    BEGIN
      IF (@recurrenceType NOT BETWEEN 0 AND 3)
      BEGIN
        ;THROW 51000, 'invalidRecurrenceType', 1;
      END;

      IF (@recurrenceInterval IS NULL OR @recurrenceInterval < 1)
      BEGIN
        ;THROW 51000, 'invalidRecurrenceInterval', 1;
      END;

      IF (@recurrenceStartDate IS NULL)
      BEGIN
        ;THROW 51000, 'recurrenceStartDateRequired', 1;
      END;

      IF (@recurrenceEndDate IS NOT NULL AND @recurrenceOccurrenceCount IS NOT NULL)
      BEGIN
        ;THROW 51000, 'cannotSpecifyBothEndDateAndOccurrenceCount', 1;
      END;

      IF (@recurrenceType = 1 AND (@recurrenceWeekDays IS NULL OR LTRIM(RTRIM(@recurrenceWeekDays)) = ''))
      BEGIN
        ;THROW 51000, 'weekDaysRequiredForWeeklyRecurrence', 1;
      END;

      IF (@recurrenceType = 2 AND (@recurrenceMonthDay IS NULL OR @recurrenceMonthDay NOT BETWEEN -1 AND 31))
      BEGIN
        ;THROW 51000, 'invalidMonthDayForMonthlyRecurrence', 1;
      END;

      IF (@recurrenceOccurrenceCount IS NOT NULL AND @recurrenceOccurrenceCount NOT BETWEEN 1 AND 100)
      BEGIN
        ;THROW 51000, 'invalidOccurrenceCount', 1;
      END;
    END;

    /**
     * @rule {db-multi-tenancy,fn-task-creation} Create task with account isolation
     */
    BEGIN TRAN;

      INSERT INTO [functional].[task] (
        [idAccount],
        [idUserCreator],
        [title],
        [description],
        [priority],
        [status],
        [dueDate],
        [dateCreated],
        [dateModified]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @description,
        @priority,
        0,
        @dueDate,
        GETUTCDATE(),
        GETUTCDATE()
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @rule {fn-task-assignment} Assign users to task
       */
      IF (@assignedUsers IS NOT NULL)
      BEGIN
        INSERT INTO [functional].[taskAssignment] (
          [idAccount],
          [idTask],
          [idUser],
          [dateAssigned]
        )
        SELECT
          @idAccount,
          @idTask,
          CAST([value] AS INTEGER),
          GETUTCDATE()
        FROM OPENJSON(@assignedUsers);
      END;

      /**
       * @rule {fn-task-recurrence} Configure task recurrence
       */
      IF (@recurrenceType IS NOT NULL)
      BEGIN
        INSERT INTO [functional].[taskRecurrence] (
          [idAccount],
          [idTask],
          [recurrenceType],
          [interval],
          [weekDays],
          [monthDay],
          [startDate],
          [endDate],
          [occurrenceCount],
          [dateCreated]
        )
        VALUES (
          @idAccount,
          @idTask,
          @recurrenceType,
          @recurrenceInterval,
          @recurrenceWeekDays,
          @recurrenceMonthDay,
          @recurrenceStartDate,
          @recurrenceEndDate,
          @recurrenceOccurrenceCount,
          GETUTCDATE()
        );
      END;

    COMMIT TRAN;

    /**
     * @output {TaskCreated, 1, 1}
     * @column {INT} idTask
     * - Description: Created task identifier
     */
    SELECT @idTask AS [idTask];

  END TRY
  BEGIN CATCH
    IF (@@TRANCOUNT > 0)
    BEGIN
      ROLLBACK TRAN;
    END;

    THROW;
  END CATCH;
END;
GO