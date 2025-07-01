﻿using Application.Templates.Commands.Create;
using Application.Templates.Commands.Delete;
using Application.Templates.Commands.Update;
using Application.Templates.Queries.GetTemplateDetails;
using Application.Templates.Queries.GetTemplates;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers
{
    public class TemplatesController : ApiControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<int>> Create([FromBody] CreateTemplateCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            await Mediator.Send(new DeleteTemplateCommand { Id = id });

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromBody] int id, [FromBody] UpdateTemplateCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await Mediator.Send(command);

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateOutputModel>> GetTemplateDetails([FromRoute] int id)
        {
            return await Mediator.Send(new GetTemplateDetailsQuery { Id = id });
        }

        [HttpGet]
        public async Task<ActionResult<List<TemplateDto>>> GetTemplates([FromQuery] GetTemplatesQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}
