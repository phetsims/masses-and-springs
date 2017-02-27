// Copyright 2016-2017, University of Colorado Boulder

/**
 * Panel that manages options for visibility for reference lines.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );

  // constants
  var LINE_LENGTH = 25;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Object} options
   * @constructor
   */
  function IndicatorVisibilityControlPanel( model, options ) {
    Node.call( this );

    // Lines added for reference in panel
    var greenLine = new Line( 0, 0, LINE_LENGTH, 0, {
      stroke: 'rgb(93, 191, 142)',
      lineDash: [ 6, 2.5 ],
      lineWidth: 2.0,
      cursor: 'pointer'
    } );

    var blueLine = new Line( 0, 0, LINE_LENGTH, 0, {
      stroke: 'rgb(65,66,232)',
      lineDash: [ 6, 2.5 ],
      lineWidth: 2.0,
      cursor: 'pointer'
    } );

    var redLine = new Line( 0, 0, LINE_LENGTH, 0, {
      stroke: 'red',
      lineDash: [ 6, 2.5 ],
      lineWidth: 2.0,
      cursor: 'pointer'
    } );
    
    var indicatorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( { children: [ new Text( naturalLengthString, MassesAndSpringsConstants.FONT ), new HStrut( 31 ), blueLine ] } ),
        property: model.naturalLengthVisibleProperty,
        label: naturalLengthString
      },
      {
        content: new HBox( { children: [ new Text( equilibriumPositionString, MassesAndSpringsConstants.FONT ), new HStrut( 10 ), greenLine ] } ),
        property: model.equilibriumPositionVisibleProperty,
        label: equilibriumPositionString
      },
      {
        content: new HBox( { children: [ new Text( movableLineString, MassesAndSpringsConstants.FONT ), new HStrut( 38 ), redLine ] } ),
        property: model.movableLineVisibleProperty,
        label: movableLineString
      }
    ], { boxWidth: 15, spacing: 5 } );
    var titleToControlsVerticalSpace = 2;
    var indicatorVisibilityControlsVBox = new VBox( {
      children: [
        new VStrut( titleToControlsVerticalSpace ),
        new HBox(
          {
            children: [
              indicatorVisibilityCheckBoxGroup,
              new HStrut( 40 )
            ]
          } )
      ],
      align: 'left'
      }
    );
    this.indicatorVisibilityControlPanel = new Panel(
      indicatorVisibilityControlsVBox,
      {
        xMargin: 10,
        fill: 'rgb( 240, 240, 240 )',
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
      }
    );
    this.addChild( this.indicatorVisibilityControlPanel );
    this.mutate( options );

  }

  massesAndSprings.register( 'IndicatorVisibilityControlPanel', IndicatorVisibilityControlPanel );

  return inherit( Node, IndicatorVisibilityControlPanel );
} );