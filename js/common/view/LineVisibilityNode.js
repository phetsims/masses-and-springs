// Copyright 2017-2018, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var massEquilibriumString = require( 'string!MASSES_AND_SPRINGS/massEquilibrium' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function LineVisibilityNode( model, tandem, options ) {
    options = _.extend( {
      massEquilibrium: false,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'LineVisibilityNode' ),
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
    }, options );

    Node.call( this, options );

    // Lines added for reference in panel
    var greenLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb(0, 180, 0)', tandem.createTandem( 'greenLine' ) );
    var blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    var redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

    var equilibriumText = new Text( equilibriumPositionString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      tandem: tandem.createTandem( 'equilibriumPositionString' )
    } );

    if ( options.massEquilibrium ) {
      equilibriumText = new Text( massEquilibriumString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        tandem: tandem.createTandem( 'equilibriumPositionString' )
      } );
    }

    var indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      content: new HBox( {
        children: [ new Text( naturalLengthString, {
          font: MassesAndSpringsConstants.TITLE_FONT
        } ) ]
      } ),
      property: model.naturalLengthVisibleProperty,
      label: naturalLengthString
    }, {
      content: new HBox( {
        children: [ equilibriumText ]
      } ),
      property: model.equilibriumPositionVisibleProperty,
      label: equilibriumPositionString
    }, {
      content: new HBox( {
        children: [ new Text( movableLineString, {
          font: MassesAndSpringsConstants.TITLE_FONT, tandem: tandem.createTandem( 'movableLineString' )
        } ) ]
      } ),
      property: model.movableLineVisibleProperty,
      label: movableLineString
    } ], {
      boxWidth: 15,
      spacing: 8,
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );
    var titleToControlsVerticalSpace = 2;
    var indicatorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( titleToControlsVerticalSpace ),
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    var lineVBox = new VBox( {
      children: [
        blueLine,
        greenLine,
        redLine
      ],
      yMargin: 0,
      spacing: 24
    } );
    var controlBox = new HBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlsVBox,
        lineVBox
      ]
    } );
    this.addChild( controlBox );
  }

  massesAndSprings.register( 'LineVisibilityNode', LineVisibilityNode );

  return inherit( Node, LineVisibilityNode );
} );