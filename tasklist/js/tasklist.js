/*!
 * Copyright 2014 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

define(['jquery', 'oae.core'], function($, oae) {

    return function(uid, showSettings, widgetData) {

        // The widget container
        var $rootel = $('#' + uid);

        /**
         * Delete a task
         */
        var deleteTask = function() {
            // Get the `created` timestamp we stored in a data attribute on the
            // button. Hilary needs it to know which task to delete
            var taskCreated = $(this).attr('data-created');

            $.ajax({
                'url': '/api/tasklist/' + taskCreated,
                'type': 'DELETE',
                'success': function(data) {
                    // Show a success notification when the task has been deleted
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__TASK_DELETED__', 'tasklist'),
                        oae.api.i18n.translate('__MSG__TASK_DELETE_SUCCESS__', 'tasklist')
                    );
                    // Retrieve the new list of tasks
                    getTasks();
                },
                'error': function() {
                    // Show a failure notification when the task couldn't be deleted
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__TASK_NOT_DELETED__', 'tasklist'),
                        oae.api.i18n.translate('__MSG__TASK_DELETE_FAILED__', 'tasklist'),
                        'error'
                    );
                }
            });
        };

        /**
         * Create a new task
         */
        var createTask = function() {
            $.ajax({
                'url': '/api/tasklist',
                'type': 'POST',
                'data': $('#tasklist-task-form', $rootel).serialize(),
                'success': function(data) {
                    // Show a success notification when the task has been created
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__TASK_CREATED__', 'tasklist'),
                        oae.api.i18n.translate('__MSG__TASK_CREATE_SUCCESS__', 'tasklist')
                    );
                    // Retrieve the new list of tasks
                    getTasks();
                    // Reset the task form
                    $('#tasklist-task-form', $rootel)[0].reset();
                },
                'error': function() {
                    // Show a failure notification when the task couldn't be created
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__TASK_NOT_CREATED__', 'tasklist'),
                        oae.api.i18n.translate('__MSG__TASK_CREATE_FAILED__', 'tasklist'),
                        'error'
                    );
                }
            });

            return false;
        };

        /**
         * Render the list of tasks
         *
         * @param  {Task[]}    tasks    Array of task objects
         */
        var renderTaskList = function(tasks) {
            oae.api.util.template().render($('#tasklist-tasks-template', $rootel), {
                'tasks': tasks
            }, $('#tasklist-tasks-container', $rootel));
        };

        /**
         * Retrieve the list of tasks
         */
        var getTasks = function() {
            $.ajax({
                'url': '/api/tasklist',
                'type': 'GET',
                'success': function(data) {
                    // Render the list of tasks in the UI
                    renderTaskList(data.tasks);
                },
                'error': function() {
                    // Show a failure notification when the task list couldn't be retrieved
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__TASKS_NOT_RETRIEVED__', 'tasklist'),
                        oae.api.i18n.translate('__MSG__TASKS_RETRIEVE_FAILED__', 'tasklist'),
                        'error'
                    );
                }
            });
        };

        /**
         * Bind to various elements in the widget
         */
        var addBinding = function() {
            // Bind to the `submit` event of the form to create a new task
            $rootel.on('submit', '#tasklist-task-form', createTask);
            // Bind to the `click` event of the delete task button to delete a task
            $rootel.on('click', '.tasklist-task-delete', deleteTask);
        };

        /**
         * Render the tasklist header
         */
        var renderTaskListHeader = function() {
            oae.api.util.template().render($('#tasklist-header-template', $rootel), null, $('#tasklist-header-container', $rootel));
        };

        /**
         * Initialize the task list widget
         */
        var initTaskList = function() {
            // Render the task list header
            renderTaskListHeader();

            // Get the tasks
            getTasks();
        };

        addBinding();
        initTaskList();

    };
});
